"""
source_tracker.py — Source tracking & structured logging for Decentrawood AI backend.
"""

import logging
import sys
from datetime import datetime

logger = logging.getLogger("source_tracker")
logger.setLevel(logging.INFO)
logger.propagate = False

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    logger.addHandler(handler)


class QuerySourceTracker:
    def __init__(self, query: str):
        self.query = query
        self.sources_used = []
        self.final_source = None
        self.navigation_url = None
        self.start_time = datetime.utcnow()

        logger.info("=" * 70)
        logger.info(f'[NEW QUERY] "{query}"')
        logger.info("=" * 70)

    def set_final_source(self, source: str):
        self.final_source = source

    def log_cache_hit(self, intent: str, response_preview: str):
        preview = (
            response_preview[:80] + "..."
            if len(response_preview) > 80
            else response_preview
        )
        logger.info(f'[CACHE] HIT - intent="{intent}"')
        self.sources_used.append("Redis Cache")
        self.set_final_source("Redis Cache")

    def log_cache_miss(self):
        logger.info("[CACHE] MISS")

    def log_intent(self, intent: str, confidence: float, needs_live_data: bool):
        logger.info(
            f'[INTENT] detected="{intent}" | confidence={confidence:.2f} | needs_live_data={needs_live_data}'
        )
        self.sources_used.append("GPT-4o Intent Detection")

    def log_external_agent(self, query: str):
        logger.info(f'[EXTERNAL] "{query}"')
        self.sources_used.append("External Agent (DuckDuckGo)")

    def log_external_agent_result(self, response_preview: str):
        preview = (
            response_preview[:100] + "..."
            if len(response_preview) > 100
            else response_preview
        )
        logger.info(f'[EXTERNAL] "{preview}"')

    def log_rag(self, docs):
        if docs:
            logger.info(f"[RAG] retrieved {len(docs)} chunks")
            self.sources_used.append(f"Qdrant RAG ({len(docs)} chunks)")
            for i, doc in enumerate(docs):
                meta = doc.metadata or {}
                url = meta.get("url") or "No URL"
                domain = meta.get("domain") or "No Domain"
                logger.info(f"  -> Chunk {i+1}: URL={url} (Domain={domain})")
        else:
            logger.info("[RAG] no relevant chunks found")

    def log_llm(
        self,
        context_length: int,
        model: str = "gpt-4o",
        history_count: int = 0,
    ):
        logger.info(
            f"[LLM] {model} | context={context_length} chars | history={history_count}"
        )
        self.sources_used.append(f"OpenAI {model}")

    def log_llm_stream_complete(self, response_length: int):
        logger.info(f"[LLM] response={response_length} chars")

    def log_navigation(
        self,
        intent: str,
        url: str,
        source: str = None,
        route: str = None,
        score: float = None,
        route_type: str = None,
        domain: str = None,
        should_navigate: bool = False,
        reason: str = None,
    ):
        if url:
            self.navigation_url = url
    
            logger.info("[NAVIGATION DECISION]")
            logger.info(f'[NAV] Query: "{self.query}"')
            logger.info(f'[NAV] Intent: "{intent}"')
            logger.info(f"[NAV] Route: {route or 'unknown'}")
            logger.info(f"[NAV] URL: {url}")
            logger.info(f"[NAV] Type: {route_type or 'unknown'}")
            logger.info(f"[NAV] Domain: {domain or 'unknown'}")
    
            if score is not None:
                logger.info(f"[NAV] Score: {score:.4f}")
    
            logger.info(f"[NAV] Should Navigate: {should_navigate}")
            logger.info(f"[NAV] Reason: {reason or 'not specified'}")
    
            if source:
                logger.info(f"[NAV] Source: {source}")
    
            self.sources_used.append(
                f"Navigation -> {url}"
                + (f" ({source})" if source else "")
            )
    
        else:
            logger.info("[NAVIGATION DECISION]")
            logger.info("[NAV] No navigation")
            logger.info(f'[NAV] Query: "{self.query}"')
            logger.info(f'[NAV] Reason: {reason or "No matching route"}')

    def log_cache_stored(self, query: str):
        logger.info(f'[CACHE] STORED "{query}"')

    def log_db_stored(self, session_id: str):
        logger.info(f'[DB] Saved session="{session_id}"')

    def log_error(self, stage: str, error):
        logger.error(f"[ERROR] {stage} -> {error}")
        self.sources_used.append(f"ERROR@{stage}")

    def finish(self):
        elapsed = (
            datetime.utcnow() - self.start_time
        ).total_seconds()

        logger.info(f"[SOURCE] {self.final_source}")
        logger.info(f"[TIME] {elapsed:.2f}s")

        return {
            "sources": self.sources_used,
            "navigation_url": self.navigation_url,
            "final_source": self.final_source,
            "elapsed_seconds": elapsed,
        }


def begin(query: str) -> QuerySourceTracker:
    return QuerySourceTracker(query)