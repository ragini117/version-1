import os
from typing import List, Dict, Any
from langchain_qdrant import QdrantVectorStore
from config import NAVIGATION_COLLECTION
from Rag.helper import download_embeddings
from infrastructure.database.qdrant_client import get_qdrant_client
from utils.logger import get_logger

logger = get_logger("route_retriever")

class RouteRetriever:
    def __init__(self, embedding=None, collection_name: str | None = None):
        self.embedding = embedding or download_embeddings()
        self.collection_name = collection_name or NAVIGATION_COLLECTION
        self.client = get_qdrant_client()
        self._vector_store = None

    def _get_vector_store(self) -> QdrantVectorStore:
        if self._vector_store is None:
            self._vector_store = QdrantVectorStore(
                client=self.client,
                collection_name=self.collection_name,
                embedding=self.embedding,
            )
        return self._vector_store

    def search_routes(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """
        Queries Qdrant routes collection for relevant navigation targets.
        """
        if not query or not query.strip():
            return []

        try:
            vector_store = self._get_vector_store()
            results_with_scores = vector_store.similarity_search_with_score(query, k=k)

            routes_with_scores = []
            for doc, score in results_with_scores:
                payload = doc.metadata or {}
                if "metadata" in payload and isinstance(payload["metadata"], dict):
                    payload = payload["metadata"]
                
                route_dict = {
                    "route_id": payload.get("route_id"),
                    "title": payload.get("title"),
                    "url": payload.get("url"),
                    "route": payload.get("route"),
                    "domain": payload.get("domain"),
                    "type": payload.get("type", "internal"),
                    "score": float(score),
                }
                routes_with_scores.append(route_dict)

            return routes_with_scores

        except Exception as exc:
            logger.error(f"Error during semantic route search: {exc}")
            return []
