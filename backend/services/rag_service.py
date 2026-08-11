from config import QDRANT_COLLECTION, QDRANT_PATH, QDRANT_URL, SIMILARITY_THRESHOLD, TOP_K
from Rag.vector_store import get_vector_store
from utils.logger import get_logger


logger = get_logger("rag_service")


class RagService:
    def __init__(self, embedding):
        self.embedding = embedding

    def retrieve(self, query: str):
        try:
            vector_store = get_vector_store(self.embedding)
        except Exception as exc:
            logger.warning(f"RAG store unavailable, falling back to empty context: {exc}")
            return {
                "docs": [],
                "context": "",
                "retrieved_documents": [],
                "rag_hit": False,
            }

        docs = []
        rag_hit = False
        try:
            docs_with_scores = vector_store.similarity_search_with_score(query, k=TOP_K)
            filtered_docs = [doc for doc, score in docs_with_scores if score >= SIMILARITY_THRESHOLD]
            if filtered_docs:
                docs = filtered_docs
                rag_hit = True
            else:
                docs = []
                rag_hit = False
        except Exception:
            # If scores aren't available, don't blindly pass docs
            docs = []
            rag_hit = False

        context = "\n\n".join(doc.page_content for doc in docs)
        retrieved_documents = [{"page_content": doc.page_content, "metadata": doc.metadata} for doc in docs]
        return {
            "docs": docs,
            "context": context,
            "retrieved_documents": retrieved_documents,
            "rag_hit": rag_hit,
        }
