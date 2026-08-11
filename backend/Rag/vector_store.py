from langchain_qdrant import QdrantVectorStore
from config import QDRANT_COLLECTION
from infrastructure.database.qdrant_client import get_qdrant_client as infra_get_qdrant_client

_vector_store = None

def get_qdrant_client():
    return infra_get_qdrant_client()

def get_vector_store(embedding):
    global _vector_store
    if _vector_store is None:
        _vector_store = QdrantVectorStore(
            client=get_qdrant_client(),
            collection_name=QDRANT_COLLECTION,
            embedding=embedding,
        )
    return _vector_store
