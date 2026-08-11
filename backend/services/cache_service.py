import time
from typing import Any, Dict, List, Optional
from cache_manager import CacheManager

class CacheService:
    def __init__(self, cache_manager: Optional[CacheManager] = None):
        self._cache = cache_manager or CacheManager()
        self._l1_cache: Dict[str, tuple[Dict[str, Any], float]] = {}  # key -> (payload, expires_at)

    def _get_l1(self, query: str) -> Optional[Dict[str, Any]]:
        normalized = query.strip().lower()
        if normalized in self._l1_cache:
            payload, expires_at = self._l1_cache[normalized]
            if time.time() < expires_at:
                return payload
            else:
                self._l1_cache.pop(normalized, None)
        return None

    def _set_l1(self, query: str, payload: Dict[str, Any], ttl: float):
        normalized = query.strip().lower()
        self._l1_cache[normalized] = (payload, time.time() + ttl)

    def get(self, query: str) -> Optional[Dict[str, Any]]:
        # Check L1 (In-Memory) Cache first
        l1_hit = self._get_l1(query)
        if l1_hit:
            return l1_hit

        # Check L2 (Redis) Cache
        l2_hit = self._cache.get_cached_response(query)
        if l2_hit:
            # Populate L1 cache for subsequent fast reads (TTL 120s or original cache age remaining)
            self._set_l1(query, l2_hit, ttl=120)
            return l2_hit

        return None

    def set(
        self,
        query: str,
        response_text: str,
        intent: str,
        confidence: float,
        retrieved_documents: list,
        decision: Optional[dict] = None,
        navigation: Optional[dict] = None,
        sources: Optional[list] = None,
        ttl_seconds: Optional[int] = None
    ) -> bool:
        # Save to L2 (Redis) Cache
        success = self._cache.set_cached_response(
            query, response_text, intent, confidence, retrieved_documents,
            decision=decision, navigation=navigation, sources=sources, ttl_seconds=ttl_seconds
        )
        
        # Save to L1 (In-memory) Cache (even if Redis fails, providing graceful degradation)
        ttl = ttl_seconds or 120
        payload = {
            "response_text": response_text,
            "intent": intent,
            "confidence": confidence,
            "retrieved_documents": retrieved_documents,
            "decision": decision or {},
            "navigation": navigation or {},
            "sources": sources or []
        }
        self._set_l1(query, payload, ttl=ttl)
        return success

    def delete(self, key_or_query: str) -> bool:
        normalized = key_or_query.strip().lower()
        self._l1_cache.pop(normalized, None)
        return self._cache.delete(key_or_query)

    def get_live(self, query: str) -> Optional[str]:
        # Live queries check cache_manager (which has its own memory fallback)
        return self._cache.get_cached_live_response(query)

    def set_live(self, query: str, response_text: str, ttl_seconds: int = 180) -> bool:
        return self._cache.set_cached_live_response(query, response_text, ttl_seconds=ttl_seconds)
