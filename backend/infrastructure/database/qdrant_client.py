from functools import lru_cache
from qdrant_client import QdrantClient
from config import QDRANT_URL, QDRANT_PATH

@lru_cache(maxsize=1)
def get_qdrant_client() -> QdrantClient:
    """
    Initializes and returns a cached QdrantClient instance.
    Falls back to a local storage path if URL is not provided.
    """
    if QDRANT_URL:
        # Connect to remote instance with custom timeouts
        return QdrantClient(url=QDRANT_URL, timeout=3.0)
    else:
        # Use local disk-based instance
        return QdrantClient(path=QDRANT_PATH)
