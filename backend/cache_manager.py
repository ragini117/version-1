import os
import hashlib
import json
import logging
import redis
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup structured logging for production grade monitoring
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CacheManager")

# Retrieve connection configuration with standard fallback defaults
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

STATIC_INTENTS = {"platform_info", "faq", "how_to", "features", "none"}
LIVE_INTENTS = {"news", "price", "market_data"}

CACHE_TTL_MAP = {
    "static": 3600 * 24,   # 24h for stuff that doesn't change
    "live": 120,            # 2 min max for price/news
}

def get_cache_ttl(intent: str) -> int:
    return CACHE_TTL_MAP["live"] if intent in LIVE_INTENTS else CACHE_TTL_MAP["static"]

# Substrings that identify a fallback/failure response — these must never be cached
# to prevent poisoning the cache with unhelpful replies.
FALLBACK_MARKERS = [
    "I couldn't find that information",
    "I encountered an error processing your request",
]

class CacheManager:
    """
    Production-grade Caching Layer using Redis.
    Provides hashed query key mapping to store and retrieve:
    - final LLM responses
    - intent detection results
    - retrieved RAG documents
    
    Implements a robust fallback mechanism to prevent application failures 
    in case the Redis server becomes unreachable.
    """
    def __init__(self):
        self.redis_client = None
        self.is_available = False
        self.memory_live_cache = {}
        self._connect()
        # Immediately purge/clear any existing stale entries for 'news' or 'price' queries
        try:
            self.delete("news")
            self.delete("price")
        except Exception as e:
            logger.warning(f"Failed to perform initial cache purge: {e}")

    def _connect(self):
        """Attempts to establish connection with the Redis server."""
        try:
            logger.info(f"Connecting to Redis at {REDIS_URL}...")
            # Using socket_timeout & socket_connect_timeout to avoid blocking operations if Redis is slow to respond
            self.redis_client = redis.from_url(
                REDIS_URL, 
                decode_responses=True,
                socket_timeout=2.0,
                socket_connect_timeout=2.0,
                retry_on_timeout=True,
                protocol=2
            )
            # Ping to confirm the connection is active
            self.redis_client.ping()
            self.is_available = True
            logger.info("Successfully connected to Redis. Caching enabled.")
        except Exception as e:
            self.is_available = False
            self.redis_client = None
            logger.warning(
                f"Redis connection failed: {e}. "
                "Chatbot optimization layer will gracefully fallback to direct execution without caching."
            )

    def _get_hash_key(self, query: str) -> str:
        """
        Generates a deterministic cache key by hashing the sanitized query string.
        Includes KB_VERSION to automatically invalidate cache when KB changes.
        """
        from config import KB_VERSION
        sanitized_query = query.strip().lower()
        query_hash = hashlib.sha256(sanitized_query.encode('utf-8')).hexdigest()
        return f"chatbot:v3:{KB_VERSION}:{query_hash}"

    def get_cached_response(self, query: str):
        """
        Retrieves cached response objects for the query.
        Returns:
            dict containing response_text, intent, confidence, retrieved_documents,
            decision, navigation, sources, or None if cache miss.
        """
        if not self.is_available or not self.redis_client:
            return None
        
        try:
            key = self._get_hash_key(query)
            cached_data = self.redis_client.get(key)
            if cached_data:
                import time
                data_dict = json.loads(cached_data)
                cached_at = data_dict.get("cached_at")
                if cached_at:
                    age = time.time() - cached_at
                    logger.info(f"Cache HIT for query: '{query}'. Cache age: {age:.2f} seconds.")
                else:
                    logger.info(f"Cache HIT for query: '{query}'. Cache age: unknown.")
                return data_dict
        except Exception as e:
            logger.error(f"Error during Redis GET operation: {e}. Falling back to normal flow.")
            self._check_health()
        return None

    def set_cached_response(self, query: str, response_text: str, intent: str, confidence: float, retrieved_documents: list, decision: dict = None, navigation: dict = None, sources: list = None, ttl_seconds: int = None) -> bool:
        """
        Saves full response payload (answer + decision + navigation + sources) in Redis.
        """
        if not self.is_available or not self.redis_client:
            return False

        if any(marker in response_text for marker in FALLBACK_MARKERS):
            logger.info(f"Skipped caching fallback response for query: '{query}'")
            return False

        if ttl_seconds is None:
            ttl_seconds = get_cache_ttl(intent)

        try:
            import time
            key = self._get_hash_key(query)
            payload = {
                "response_text": response_text,
                "intent": intent,
                "confidence": confidence,
                "retrieved_documents": retrieved_documents,
                "decision": decision or {},
                "navigation": navigation or {},
                "sources": sources or [],
                "cached_at": time.time()
            }
            self.redis_client.setex(
                name=key,
                time=ttl_seconds,
                value=json.dumps(payload)
            )
            logger.info(f"Cache STORED for query: '{query}' with TTL {ttl_seconds}s")
            return True
        except Exception as e:
            logger.error(f"Error during Redis SET operation: {e}")
            self._check_health()
            return False


    def delete(self, key_or_query: str) -> bool:
        """
        Deletes a cached response. Accepts either a query (which is hashed) or a direct Redis key pattern.
        Also scans and deletes keys matching patterns containing key_or_query.
        """
        sanitized = key_or_query.strip().lower()
        self.memory_live_cache.pop(sanitized, None)

        if not self.is_available or not self.redis_client:
            return True

        try:
            # Try to delete query hash key
            direct_key = self._get_hash_key(key_or_query)
            res1 = self.redis_client.delete(direct_key)
            
            # Try to delete directly as raw key
            res2 = self.redis_client.delete(key_or_query)
            
            # Scan and delete patterns
            keys_to_del = self.redis_client.keys(f"*{key_or_query}*")
            res3 = 0
            if keys_to_del:
                res3 = self.redis_client.delete(*keys_to_del)
                
            logger.info(f"Purged cache for '{key_or_query}'. Deleted direct_key={res1}, raw_key={res2}, pattern_keys={res3}")
            return True
        except Exception as e:
            logger.error(f"Error during cache delete / invalidation: {e}")
            return False

    def _check_health(self):
        """Internal helper to verify if connection is still healthy, resets status if down."""
        try:
            if self.redis_client:
                self.redis_client.ping()
                self.is_available = True
            else:
                self._connect()
        except Exception:
            self.is_available = False
            logger.warning("Redis server is currently down. Caching disabled.")

    def get_cached_live_response(self, query: str) -> str:
        """
        Retrieves cached live agent response for the query.
        Falls back to in-memory cache if Redis is down.
        """
        sanitized_query = query.strip().lower()
        if self.is_available and self.redis_client:
            try:
                query_hash = hashlib.sha256(sanitized_query.encode('utf-8')).hexdigest()
                key = f"chatbot:live_cache:{query_hash}"
                val = self.redis_client.get(key)
                if val:
                    logger.info(f"Redis Live Cache HIT for query: '{query}'")
                    return val
            except Exception as e:
                logger.error(f"Error during Redis live GET: {e}")
        
        # Memory cache fallback
        import time
        if sanitized_query in self.memory_live_cache:
            val, expiry = self.memory_live_cache[sanitized_query]
            if time.time() < expiry:
                logger.info(f"Memory Live Cache HIT for query: '{query}'")
                return val
            else:
                self.memory_live_cache.pop(sanitized_query, None)
        return None

    def set_cached_live_response(self, query: str, response_text: str, ttl_seconds: int = 180) -> bool:
        """
        Saves live response in both memory cache and Redis.
        """
        sanitized_query = query.strip().lower()
        import time
        self.memory_live_cache[sanitized_query] = (response_text, time.time() + ttl_seconds)
        
        if self.is_available and self.redis_client:
            try:
                query_hash = hashlib.sha256(sanitized_query.encode('utf-8')).hexdigest()
                key = f"chatbot:live_cache:{query_hash}"
                self.redis_client.setex(key, ttl_seconds, response_text)
                logger.info(f"Redis Live Cache STORED for query: '{query}' with TTL {ttl_seconds}s")
                return True
            except Exception as e:
                logger.error(f"Error during Redis live SET: {e}")
        return False
