import asyncio
import datetime
import json
import os
import time
import uuid
import jwt

from config import JWT_SECRET, MODEL_NAME, ROUTES_ENRICHED_PATH
from services.cache_service import CacheService
from services.history_service import HistoryService
from services.conversation_manager import ConversationManager
from services.intent_classifier import IntentClassifier
from services.navigation_service import NavigationService
from services.response_generator import ResponseGenerator
from retrieval.route_retriever import RouteRetriever
from retrieval.rag_retriever import RagRetriever
from retrieval.web_search_retriever import WebSearchRetriever
from navigation.navigation_decision import make_navigation_decision
from source_tracker import begin as begin_tracking
from utils.logger import get_logger
from voice.config import VOICE_SKIP_ROUTE_RETRIEVAL
from voice.navigation import apply_voice_navigation_policy

logger = get_logger("chat_orchestrator")

OUT_OF_SCOPE_MESSAGE = (
    "I can only answer questions related to Decentrawood and its Web3 ecosystem. "
    "Contact info@decentrawood.com."
)

class ChatOrchestrator:
    def __init__(self, embedding):
        self.cache_service = CacheService()
        self.history_service = HistoryService()
        self.conversation_manager = ConversationManager()
        self.intent_classifier = IntentClassifier(MODEL_NAME)
        self.route_retriever = RouteRetriever(embedding=embedding)
        self.rag_retriever = RagRetriever(embedding)
        self.navigation_service = NavigationService()
        self.response_generator = ResponseGenerator(MODEL_NAME)
        self.web_search_retriever = WebSearchRetriever()

        # Build domain → route lookup from routes_enriched.json for RAG-based
        # external link fallback (used when semantic route retrieval is ambiguous).
        self._domain_to_route: dict = {}
        try:
            with open(ROUTES_ENRICHED_PATH, "r", encoding="utf-8") as f:
                _routes = json.load(f)
            for r in _routes:
                rtype = r.get("type", "internal")
                if rtype != "internal":
                    domain = r.get("domain", "")
                    if domain:
                        self._domain_to_route[domain.lower()] = {
                            "route_id": r.get("route_id"),
                            "url": r.get("url"),
                            "route": r.get("route"),
                            "label": r.get("title"),
                            "type": rtype,
                            "domain": domain,
                            "confidence": 0.5,
                        }
        except Exception as exc:
            logger.warning("[ORCHESTRATOR] Could not load routes for domain lookup: %s", exc)

    def _get_rag_external_route(self, retrieved_documents: list) -> dict | None:
        """
        Scan RAG retrieved documents for an external domain URL.
        Returns the first matching external route from the domain lookup, or None.
        Skips internal decentrawood.com chunks — those are handled by route retriever.
        Prefers the first external domain found (by doc order = relevance order).
        """
        INTERNAL_DOMAINS = {"decentrawood.com", "www.decentrawood.com", "localhost", "127.0.0.1"}

        for doc in (retrieved_documents or []):
            meta = doc.get("metadata", {})
            domain = (meta.get("domain") or "").lower().strip()

            # Fallback: derive domain from url metadata field
            if not domain:
                url = meta.get("url", "")
                if url:
                    try:
                        from urllib.parse import urlparse
                        domain = urlparse(url).netloc.lower().split(":")[0]
                    except Exception:
                        pass

            if not domain:
                continue

            # Skip internal domains — only external domains get a link card
            if domain in INTERNAL_DOMAINS:
                continue

            route = self._domain_to_route.get(domain)
            if route:
                return route

        return None

    async def _resolve_session(self, token: str | None):
        token_doc = await asyncio.to_thread(self.history_service.verify_token, token) if token else None
        if token_doc:
            return token_doc.get("session_id"), token

        session_id = str(uuid.uuid4())
        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        active_token = jwt.encode({"session_id": session_id, "exp": expiration}, JWT_SECRET, algorithm="HS256")
        await asyncio.to_thread(self.history_service.save_token, active_token, session_id)
        return session_id, active_token

    def _log_stage_timings(self, timings: dict):
        for stage_name, elapsed_seconds in timings.items():
            if stage_name == "total":
                continue
            logger.info(f"[TIMING] {stage_name.replace('_', ' ').title()}: {elapsed_seconds:.2f}s")
        if "total" in timings:
            logger.info(f"[TIMING] Total Response Time: {timings['total']:.2f}s")

    def _finalize_result(self, result: dict, voice_mode: bool) -> dict:
        if not voice_mode:
            return result
        finalized = apply_voice_navigation_policy(result)
        finalized["voice_mode"] = True
        return finalized

    async def handle_message(
        self,
        user_message: str,
        token: str | None = None,
        voice_mode: bool = False,
    ) -> dict:
        session_id, active_token = await self._resolve_session(token)
        tracker = begin_tracking(user_message)
        timings = {}
        start_total = time.perf_counter()

        history_list = await asyncio.to_thread(self.history_service.get_chat_history, session_id)
        conversation_context = await asyncio.to_thread(self.conversation_manager.process_query, session_id, user_message, history_list)
        query_for_pipeline = conversation_context.rewritten_query

        logger.info(
            "[ORCHESTRATOR] session=%s original_query=%r rewritten_query=%r rewrite_reason=%s",
            session_id,
            user_message,
            query_for_pipeline,
            conversation_context.metadata.get("rewrite_reason", "—"),
        )
        
        # Handle clarification needed
        if conversation_context.clarification_required:
            response_text = "I'm not sure which one you mean. Could you please clarify?"
            
            decision = {"type": "ANSWER", "answer_required": True, "navigation_required": False}
            navigation = {"should_navigate": False, "primary_route": None, "related_routes": []}
            
            tracker.set_final_source("Conversation Intent - Clarification")
            await asyncio.to_thread(
                self.history_service.save_chat,
                session_id, user_message, response_text,
                intent="clarification", navigation_route=None, decision=decision,
                navigation=navigation, confidence=1.0,
            )
            result = tracker.finish()
            return self._finalize_result({
                "response_text": response_text,
                "intent": "clarification",
                "confidence": 1.0,
                "retrieved_documents": [],
                "decision": decision,
                "navigation": navigation,
                "sources": result["sources"],
                "session_id": session_id,
                "token": active_token,
                "navigate_to": None,
                "timings": {**timings, "total": time.perf_counter() - start_total},
            }, voice_mode)

        # Handle conversational greetings before RAG/domain validation
        if self.intent_classifier.is_greeting(query_for_pipeline):
            response_text = "Hello! How can I help you with Decentrawood and its Web3 ecosystem?"

            decision = {
                "type": "ANSWER",
                "answer_required": True,
                "navigation_required": False,
            }

            navigation = {
                "should_navigate": False,
                "primary_route": None,
                "related_routes": [],
            }

            tracker.log_intent("greeting", 1.0, False)
            tracker.set_final_source("Conversation Intent - Greeting")

            await asyncio.to_thread(
                self.history_service.save_chat,
                session_id,
                user_message,
                response_text,
                intent="greeting",
                navigation_route=None,
                decision=decision,
                navigation=navigation,
                confidence=1.0,
            )

            result = tracker.finish()

            return self._finalize_result({
                "response_text": response_text,
                "intent": "greeting",
                "confidence": 1.0,
                "retrieved_documents": [],
                "decision": decision,
                "navigation": navigation,
                "sources": result["sources"],
                "session_id": session_id,
                "token": active_token,
                "navigate_to": None,
                "timings": {
                    **timings,
                    "total": time.perf_counter() - start_total,
                },
            }, voice_mode)

        # Check Cache
        cached = None
        cache_start = time.perf_counter()
        if not self.intent_classifier.needs_live_data(query_for_pipeline):
            cached = await asyncio.to_thread(self.cache_service.get, query_for_pipeline)
        timings["cache"] = time.perf_counter() - cache_start

        if cached:
            # OOD CACHE GUARD: if this query is out-of-domain, the cached entry
            # may predate the OOD fix and contain a general-knowledge answer.
            # Delete the stale entry and fall through so the OOD short-circuit
            # runs cleanly. In-domain cache hits are served normally.
            if not self.intent_classifier.is_in_domain(query_for_pipeline):
                logger.info("[CACHE] OOD stale-cache detected — invalidating entry for %r", query_for_pipeline)
                await asyncio.to_thread(self.cache_service.delete, query_for_pipeline)
                cached = None

        if cached:
            intent = cached.get("intent", "none")
            response_text = cached.get("response_text", "")
            confidence = cached.get("confidence", 1.0)
            retrieved_documents = cached.get("retrieved_documents", [])
            decision = cached.get("decision")
            navigation = cached.get("navigation")
            sources = cached.get("sources", [])

            primary_route = navigation.get("primary_route") if navigation else None
            # navigate_to is only set for internal routes; derive AFTER process_navigation
            pre_navigate_to = primary_route.get("url") if primary_route else None

            # Process navigation and rewrite URLs
            response_text, navigate_to, decision, navigation = self.navigation_service.process_navigation(
                response_text, pre_navigate_to, decision, navigation, primary_route=primary_route
            )

            nav_cache_source = "Cached Route (Qdrant/Config)" if navigate_to else None
            tracker.log_cache_hit(intent, response_text)
            tracker.log_navigation(intent, navigate_to, source=nav_cache_source)
            await asyncio.to_thread(
                self.history_service.save_chat,
                session_id, user_message, response_text,
                intent=intent, navigation_route=navigate_to, decision=decision,
                navigation=navigation, confidence=confidence,
            )
            tracker.log_db_stored(session_id)
            self._log_stage_timings({**timings, "total": time.perf_counter() - start_total})
            result = tracker.finish()
            return self._finalize_result({
                "response_text": response_text,
                "intent": intent,
                "confidence": confidence,
                "retrieved_documents": retrieved_documents,
                "decision": decision or {"type": "BOTH" if navigate_to else "ANSWER", "answer_required": True, "navigation_required": bool(navigate_to)},
                "navigation": navigation or {
                    "should_navigate": bool(navigate_to),
                    "primary_route": {"url": navigate_to, "label": intent, "type": "internal", "confidence": confidence} if navigate_to else None,
                    "related_routes": []
                },
                "sources": sources or result["sources"],
                "session_id": session_id,
                "token": active_token,
                "navigate_to": navigate_to,
                "timings": {**timings, "total": time.perf_counter() - start_total},
            }, voice_mode)

        tracker.log_cache_miss()

        # Parallel Retrieval — skip route search in voice mode (answer-only)
        stage_start = time.perf_counter()
        if voice_mode and VOICE_SKIP_ROUTE_RETRIEVAL:
            nav_routes = []
            rag_result = await asyncio.to_thread(self.rag_retriever.retrieve, query_for_pipeline)
        else:
            nav_routes, rag_result = await asyncio.gather(
                asyncio.to_thread(self.route_retriever.search_routes, query_for_pipeline, k=10),
                asyncio.to_thread(self.rag_retriever.retrieve, query_for_pipeline),
            )
        parallel_elapsed = time.perf_counter() - stage_start
        timings["nav_retrieval"] = parallel_elapsed
        timings["rag"] = parallel_elapsed

        intent = "none"
        confidence = 0.0
        needs_live_data_intent = False
        tracker.log_intent(intent, confidence, needs_live_data_intent)
        tracker.log_rag(rag_result["docs"])

        answer_score = 1.0 if rag_result.get("rag_hit") else 0.0

        decision_obj = make_navigation_decision(
            answer_score,
            nav_routes,
            rag_docs=rag_result.get("retrieved_documents", []),
            voice_mode=voice_mode,
        )
        decision = decision_obj["decision"]
        navigation = decision_obj["navigation"]

        primary_route = navigation.get("primary_route")
        navigate_to = primary_route.get("url") if primary_route else None
        nav_source = "Qdrant Vector DB (decentrawood_routes)" if navigate_to else None

        # RAG-BASED EXTERNAL LINK FALLBACK
        # If the semantic route retriever didn't produce a primary_route (e.g.
        # because the margin between top-2 candidates was too tight for internal
        # routes, or the external score was borderline), derive the external link
        # directly from the RAG retrieved docs. This covers gaming, culture,
        # staking, deod.ai, glamour, and any other external subdomain whose
        # chunks were retrieved to answer the question.
        if not primary_route and not voice_mode:
            rag_route = self._get_rag_external_route(rag_result.get("retrieved_documents", []))
            if rag_route:
                primary_route = rag_route
                navigation["primary_route"] = rag_route
                nav_source = "RAG Doc Metadata (external domain fallback)"

        # Live queries
        is_live_query = bool(self.intent_classifier.needs_live_data(query_for_pipeline))

        if is_live_query:
            cached_live = None
            if not self.intent_classifier.is_price_query(query_for_pipeline):
                cached_live = await asyncio.to_thread(self.cache_service.get_live, query_for_pipeline)
            if cached_live:
                response_text = cached_live
                tracker.set_final_source("Redis Live Cache")
            else:
                search_query = self.intent_classifier.enhance_live_query(query_for_pipeline)
                tracker.log_external_agent(search_query)
                raw_result = await asyncio.to_thread(self.web_search_retriever.search, search_query)
                tracker.log_external_agent_result(raw_result)
                
                if "info@decentrawood.com" in raw_result:
                    response_text = raw_result
                    tracker.set_final_source("Domain Classifier (Out of Scope Fallback)")
                elif raw_result == "__TIMEOUT__":
                    response_text = "Prices change fast — for the most accurate current DEOD price, check CoinGecko or CoinMarketCap directly."
                    tracker.set_final_source("External Agent (DuckDuckGo Timeout Fallback)")
                elif raw_result == "__ERROR__":
                    response_text = "I'm sorry, I couldn't fetch that information right now. Please try again."
                    tracker.set_final_source("External Agent (DuckDuckGo Error Fallback)")
                else:
                    response_text = await asyncio.to_thread(
                        self.response_generator.reformat_live_response, query_for_pipeline, raw_result, history_list
                    )
                    tracker.set_final_source("External Agent (DuckDuckGo Search)")
                    if not self.intent_classifier.is_price_query(query_for_pipeline):
                        await asyncio.to_thread(
                            self.cache_service.set_live, query_for_pipeline, response_text, ttl_seconds=120
                        )

            # Apply post-processing to block navigation to specific URLs & append them to response_text
            response_text, navigate_to, decision, navigation = self.navigation_service.process_navigation(
                response_text, navigate_to, decision, navigation, primary_route=primary_route
            )

            nav_url = navigate_to or (primary_route.get("url") if primary_route else None)
            nav_type = primary_route.get("type") if primary_route else None
            tracker.log_navigation(intent, nav_url, source=nav_source, route_type=nav_type, should_navigate=bool(navigate_to))

            result = tracker.finish()
            if not self.intent_classifier.is_price_query(query_for_pipeline):
                await asyncio.to_thread(
                    self.cache_service.set,
                    query_for_pipeline, response_text, intent, confidence, [],
                    decision=decision, navigation=navigation, sources=result["sources"],
                )
            await asyncio.to_thread(
                self.history_service.save_chat,
                session_id, user_message, response_text,
                intent=intent, navigation_route=navigate_to, decision=decision,
                navigation=navigation, confidence=confidence,
            )
            tracker.log_db_stored(session_id)
            self._log_stage_timings({**timings, "total": time.perf_counter() - start_total})
            return self._finalize_result({
                "response_text": response_text,
                "intent": intent,
                "confidence": confidence,
                "retrieved_documents": [],
                "decision": decision,
                "navigation": navigation,
                "sources": result["sources"],
                "session_id": session_id,
                "token": active_token,
                "navigate_to": navigate_to,
                "timings": {**timings, "total": time.perf_counter() - start_total},
            }, voice_mode)

        # OUT-OF-DOMAIN SHORT-CIRCUIT
        # If RAG found no relevant chunks AND the query has no connection to
        # Decentrawood / Web3, do NOT call the LLM. Return the out-of-scope
        # message directly. This prevents GPT from answering with general
        # knowledge (e.g. explaining what paneer is).
        #
        # If the query IS in-domain but the KB simply has no chunk for it,
        # we still fall through to the LLM (Tier 2 behaviour is preserved).
        if not rag_result.get("rag_hit") and not self.intent_classifier.is_in_domain(query_for_pipeline):
            logger.info("[DOMAIN] OUT_OF_DOMAIN — skipping LLM")
            response_text = OUT_OF_SCOPE_MESSAGE
            navigate_to = None
            decision = {"type": "ANSWER", "answer_required": True, "navigation_required": False}
            navigation = {"should_navigate": False, "primary_route": None, "related_routes": []}
            tracker.set_final_source("Out-of-Domain Short-Circuit (no LLM call)")
            response_text, navigate_to, decision, navigation = self.navigation_service.process_navigation(
                response_text, navigate_to, decision, navigation, primary_route=None
            )
            tracker.log_navigation(intent, None, source=None, should_navigate=False)
            result = tracker.finish()
            # Do NOT cache OOD responses — they should never be persisted so the
            # short-circuit always re-evaluates the query on subsequent requests.
            await asyncio.to_thread(
                self.history_service.save_chat,
                session_id, user_message, response_text,
                intent=intent, navigation_route=None, decision=decision,
                navigation=navigation, confidence=confidence,
            )
            tracker.log_db_stored(session_id)
            self._log_stage_timings({**timings, "total": time.perf_counter() - start_total})
            return self._finalize_result({
                "response_text": response_text,
                "intent": intent,
                "confidence": confidence,
                "retrieved_documents": [],
                "decision": decision,
                "navigation": navigation,
                "sources": result["sources"],
                "session_id": session_id,
                "token": active_token,
                "navigate_to": None,
                "timings": {**timings, "total": time.perf_counter() - start_total},
            }, voice_mode)

        # RAG / LLM Answer Generation
        response_start = time.perf_counter()
        response_text = await asyncio.to_thread(
            self.response_generator.generate_response, rag_result["context"], history_list[-20:], query_for_pipeline
        )
        timings["gpt"] = time.perf_counter() - response_start
        tracker.log_llm(context_length=len(rag_result["context"]), model=MODEL_NAME, history_count=len(history_list[-20:]))
        tracker.log_llm_stream_complete(len(response_text))
        tracker.set_final_source("OpenAI LLM (gpt-4o) using Qdrant RAG")

        # SAFETY NET: handle model judging out of scope
        if response_text.strip() == OUT_OF_SCOPE_MESSAGE:
            navigate_to = None
            decision = {"type": "ANSWER", "answer_required": True, "navigation_required": False}
            navigation = {"should_navigate": False, "primary_route": None, "related_routes": []}
            tracker.set_final_source("OpenAI LLM (Tier 4 Out-of-Scope Fallback)")

        # Post-process external domains and rewrite URLs
        response_text, navigate_to, decision, navigation = self.navigation_service.process_navigation(
            response_text, navigate_to, decision, navigation, primary_route=primary_route
        )

        nav_url = navigate_to or (primary_route.get("url") if primary_route else None)
        nav_type = primary_route.get("type") if primary_route else None
        tracker.log_navigation(intent, nav_url, source=nav_source, route_type=nav_type, should_navigate=bool(navigate_to))

        result = tracker.finish()

        if not self.intent_classifier.is_price_query(query_for_pipeline):
            await asyncio.to_thread(
                self.cache_service.set,
                query_for_pipeline, response_text, intent, confidence, rag_result["retrieved_documents"],
                decision=decision, navigation=navigation, sources=result["sources"],
            )
            tracker.log_cache_stored(query_for_pipeline)

        await asyncio.to_thread(
            self.history_service.save_chat,
            session_id, user_message, response_text,
            intent=intent, navigation_route=navigate_to, decision=decision,
            navigation=navigation, confidence=confidence,
        )
        tracker.log_db_stored(session_id)
        self._log_stage_timings({**timings, "total": time.perf_counter() - start_total})

        return self._finalize_result({
            "response_text": response_text,
            "intent": intent,
            "confidence": confidence,
            "retrieved_documents": rag_result["retrieved_documents"],
            "decision": decision,
            "navigation": navigation,
            "sources": result["sources"],
            "session_id": session_id,
            "token": active_token,
            "navigate_to": navigate_to,
            "timings": {**timings, "total": time.perf_counter() - start_total},
        }, voice_mode)