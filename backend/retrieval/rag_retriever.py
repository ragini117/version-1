from typing import List, Dict, Any
from langchain_qdrant import QdrantVectorStore
from infrastructure.database.qdrant_client import get_qdrant_client
from config import QDRANT_COLLECTION, SIMILARITY_THRESHOLD, TOP_K
from utils.logger import get_logger

logger = get_logger("rag_retriever")

# Evidence-based threshold (diagnostic run 2026-08-12):
# Valid Decentrawood queries score 0.45-0.69 semantically (all-MiniLM-L6-v2).
# Irrelevant queries ("bake a cake") top out at ~0.17.
_EFFECTIVE_THRESHOLD = 0.45

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

    def _compress_context(self, docs_with_scores: List[tuple], threshold: float) -> List[tuple]:
        """
        Filters out documents below similarity threshold and reduces redundancy.
        """
        filtered = []
        seen_contents = set()
        
        for doc, score in docs_with_scores:
            if score < threshold:
                continue
            
            # Simple content duplicate check
            normalized_content = " ".join(doc.page_content.lower().split()[:20])
            if normalized_content in seen_contents:
                continue
                
            seen_contents.add(normalized_content)
            filtered.append((doc, score))
            
        return filtered

    def retrieve(self, query: str) -> Dict[str, Any]:
        """
        Executes a semantic search with context compression, metadata-based 
        source tracking, and full retrieval diagnostics logging.
        """
        logger.info("[RETRIEVAL] original_query=%r collection=%r top_k=%d threshold=%.4f",
                    query, self.collection_name, TOP_K, _EFFECTIVE_THRESHOLD)

        try:
            vector_store = self._get_vector_store()
        except Exception as exc:
            logger.warning("[RETRIEVAL] RAG store connection failed: %s", exc)
            return {
                "docs": [],
                "context": "",
                "retrieved_documents": [],
                "rag_hit": False,
            }

        try:
            # Query Qdrant for semantic matches
            raw_results = vector_store.similarity_search_with_score(query, k=TOP_K)

            # Log raw scores so we can audit what Qdrant returned
            for doc, score in raw_results:
                meta = doc.metadata or {}
                logger.info(
                    "[RETRIEVAL] raw_score=%.4f chunk_id=%r title=%r content_len=%d content_preview=%r",
                    score,
                    meta.get("chunk_id"),
                    meta.get("title"),
                    len(doc.page_content),
                    doc.page_content[:120],
                )

            # Apply evidence-based threshold and deduplication
            final_results = self._compress_context(raw_results, _EFFECTIVE_THRESHOLD)

            logger.info(
                "[RETRIEVAL] after_threshold=%.4f: %d/%d chunks passed",
                _EFFECTIVE_THRESHOLD, len(final_results), len(raw_results),
            )

            if final_results:
                docs = [doc for doc, _ in final_results]
                rag_hit = True
            else:
                docs = []
                rag_hit = False

        except Exception as exc:
            logger.error("[RETRIEVAL] Error during similarity search: %s", exc)
            docs = []
            rag_hit = False

        # Build context block and track sources with detailed attribution
        context_parts = []
        retrieved_documents = []

        for doc in docs:
            meta = doc.metadata or {}
            logger.info(
                "[RETRIEVAL] sending_to_LLM chunk_id=%r title=%r content_len=%d",
                meta.get("chunk_id"),
                meta.get("title"),
                len(doc.page_content),
            )
            context_parts.append(doc.page_content)
            retrieved_documents.append({
                "page_content": doc.page_content,
                "metadata": {
                    "chunk_id": meta.get("chunk_id"),
                    "document_id": meta.get("document_id"),
                    "title": meta.get("title"),
                    "section": meta.get("section"),
                    "url": meta.get("url"),
                    "domain": meta.get("domain"),
                    "type": meta.get("type"),
                    "category": meta.get("category")
                }
            })

        context = "\n\n".join(context_parts)
        logger.info(
            "[RETRIEVAL] rag_hit=%s docs_sent=%d context_chars=%d",
            rag_hit, len(docs), len(context),
        )
        return {
            "docs": docs,
            "context": context,
            "retrieved_documents": retrieved_documents,
            "rag_hit": rag_hit,
        }
