import re
from typing import List, Dict, Any
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
from infrastructure.database.qdrant_client import get_qdrant_client
from config import QDRANT_COLLECTION, SIMILARITY_THRESHOLD, TOP_K
from utils.logger import get_logger

logger = get_logger("rag_retriever")

class RagRetriever:
    def __init__(self, embedding, collection_name: str | None = None):
        self.embedding = embedding
        self.collection_name = collection_name or QDRANT_COLLECTION
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

    def _keyword_rerank(self, query: str, docs_with_scores: List[tuple]) -> List[tuple]:
        """
        Calculates a hybrid score by combining semantic similarity score and keyword matching.
        """
        # Extract alphanumeric tokens of length > 2
        query_terms = set(re.findall(r"\b\w{3,}\b", query.lower()))
        if not query_terms:
            return docs_with_scores

        reranked = []
        for doc, semantic_score in docs_with_scores:
            content_lower = doc.page_content.lower()
            # Calculate word overlap
            matches = sum(1 for term in query_terms if term in content_lower)
            keyword_score = matches / len(query_terms)

            # Hybrid rescoring: 70% semantic, 30% keyword overlap
            hybrid_score = (semantic_score * 0.7) + (keyword_score * 0.3)
            reranked.append((doc, hybrid_score))

        # Sort descending by the hybrid score
        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked

    def _compress_context(self, docs_with_scores: List[tuple], threshold: float) -> List[tuple]:
        """
        Filters out documents below similarity threshold and reduces redundancy.
        """
        filtered = []
        seen_contents = set()
        
        for doc, score in docs_with_scores:
            if score < threshold:
                continue
            
            # Simple content duplicate check (using a normalized snippet signature)
            normalized_content = " ".join(doc.page_content.lower().split()[:20])
            if normalized_content in seen_contents:
                continue
                
            seen_contents.add(normalized_content)
            filtered.append((doc, score))
            
        return filtered

    def retrieve(self, query: str) -> Dict[str, Any]:
        """
        Executes a hybrid search (semantic + keyword overlap boosting) with 
        context compression and metadata-based source tracking.
        """
        try:
            vector_store = self._get_vector_store()
        except Exception as exc:
            logger.warning(f"RAG store connection failed: {exc}")
            return {
                "docs": [],
                "context": "",
                "retrieved_documents": [],
                "rag_hit": False,
            }

        try:
            # Query Qdrant for semantic matches
            raw_results = vector_store.similarity_search_with_score(query, k=TOP_K)
            
            # Apply keyword-boost hybrid reranking
            reranked_results = self._keyword_rerank(query, raw_results)
            
            # Apply threshold filtering and deduplication
            final_results = self._compress_context(reranked_results, SIMILARITY_THRESHOLD)
            
            if final_results:
                docs = [doc for doc, _ in final_results]
                rag_hit = True
            else:
                docs = []
                rag_hit = False

        except Exception as exc:
            logger.error(f"Error during similarity search: {exc}")
            docs = []
            rag_hit = False

        # Build context block and track sources with detailed attribution
        context_parts = []
        retrieved_documents = []
        
        for doc in docs:
            # Context string builder
            context_parts.append(doc.page_content)
            
            # Attribution payload
            meta = doc.metadata or {}
            retrieved_documents.append({
                "page_content": doc.page_content,
                "metadata": {
                    "chunk_id": meta.get("chunk_id"),
                    "title": meta.get("title"),
                    "section": meta.get("section"),
                    "url": meta.get("url"),
                    "category": meta.get("category")
                }
            })

        context = "\n\n".join(context_parts)
        return {
            "docs": docs,
            "context": context,
            "retrieved_documents": retrieved_documents,
            "rag_hit": rag_hit,
        }
