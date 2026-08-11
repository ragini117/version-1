import asyncio
import datetime
import time
import uuid
import jwt

from config import JWT_SECRET, MODEL_NAME
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

    async def handle_message(self, user_message: str, token: str | None = None) -> dict:
        session_id, active_token = await self._resolve_session(token)
        tracker = begin_tracking(user_message)
        timings = {}
        start_total = time.perf_counter()

        history_list = await asyncio.to_thread(self.history_service.get_chat_history, session_id)
        conversation_context = self.conversation_manager.process_query(session_id, user_message, history_list)
        query_for_pipeline = conversation_context.rewritten_query

        # Check Cache
        cached = None
        cache_start = time.perf_counter()
        if not self.intent_classifier.needs_live_data(query_for_pipeline):
            cached = await asyncio.to_thread(self.cache_service.get, query_for_pipeline)
        timings["cache"] = time.perf_counter() - cache_start

        if cached:
            intent = cached.get("intent", "none")
            response_text = cached.get("response_text", "")
            confidence = cached.get("confidence", 1.0)
            retrieved_documents = cached.get("retrieved_documents", [])
            decision = cached.get("decision")
            navigation = cached.get("navigation")
            sources = cached.get("sources", [])

            primary_route = navigation.get("primary_route") if navigation else None
            navigate_to = primary_route.get("url") if primary_route else None

            # Process navigation and rewrite URLs
            response_text, navigate_to, decision, navigation = self.navigation_service.process_navigation(
                response_text, navigate_to, decision, navigation, primary_route=primary_route
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
            return {
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
            }

        tracker.log_cache_miss()

        # Parallel Retrieval
        stage_start = time.perf_counter()
        nav_routes, rag_result = await asyncio.gather(
            asyncio.to_thread(self.route_retriever.search_routes, query_for_pipeline, k=5),
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

        domain_result = None
        answer_score = 1.0 if rag_result.get("rag_hit") else 0.0

        decision_obj = make_navigation_decision(answer_score, nav_routes)
        decision = decision_obj["decision"]
        navigation = decision_obj["navigation"]

        primary_route = navigation.get("primary_route") if navigation.get("should_navigate") else None
        navigate_to = primary_route.get("url") if primary_route else None
        nav_source = "Qdrant Vector DB (decentrawood_routes)" if navigate_to else None

        # Check Domain Scope
        if not rag_result["rag_hit"]:
            domain_result = await asyncio.to_thread(self.intent_classifier.check_domain, query_for_pipeline)
            if not domain_result["is_domain"]:
                response_text = OUT_OF_SCOPE_MESSAGE
                navigate_to = None
                decision = {"type": "ANSWER", "answer_required": True, "navigation_required": False}
                navigation = {"should_navigate": False, "primary_route": None, "related_routes": []}
                
                await asyncio.to_thread(
                    self.history_service.save_chat,
                    session_id, user_message, response_text,
                    intent=intent, navigation_route=navigate_to, decision=decision,
                    navigation=navigation, confidence=confidence,
                )
                tracker.log_db_stored(session_id)
                self._log_stage_timings({**timings, "total": time.perf_counter() - start_total})
                tracker.set_final_source("Domain Classifier (Out of Scope Fallback)")
                result = tracker.finish()
                return {
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
                }

        is_live_query = bool(self.intent_classifier.needs_live_data(query_for_pipeline))

        if is_live_query:
            if domain_result is None:
                domain_result = await asyncio.to_thread(self.intent_classifier.check_domain, query_for_pipeline)
            
            if not domain_result["is_domain"]:
                response_text = OUT_OF_SCOPE_MESSAGE
                navigate_to = None
                decision = {"type": "ANSWER", "answer_required": True, "navigation_required": False}
                navigation = {"should_navigate": False, "primary_route": None, "related_routes": []}
            else:
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
            return {
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
            }

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
        
        return {
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
        }