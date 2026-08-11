from functools import lru_cache
import redis
from config import REDIS_URL

@lru_cache(maxsize=1)
def get_redis_client() -> redis.Redis:
    """
    Returns a Redis client instance configured with connection pooling,
    automatic retries, and timeouts.
    """
    return redis.from_url(
        REDIS_URL,
        decode_responses=True,
        socket_timeout=2.0,
        socket_connect_timeout=2.0,
        retry_on_timeout=True,
        max_connections=20,
        protocol=2
    )
