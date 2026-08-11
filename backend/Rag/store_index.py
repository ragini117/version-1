import os
import sys

from langchain_qdrant import QdrantVectorStore
from qdrant_client.models import Distance, VectorParams

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(_THIS_DIR, ".."))

from config import BASE_DIR, QDRANT_COLLECTION  # noqa: E402
from Rag.helper import download_embeddings, load_json_chunks  # noqa: E402
from Rag.vector_store import get_qdrant_client  # noqa: E402

CHUNKS_JSON_PATH = os.getenv(
    "CHUNKS_JSON_PATH",
    os.path.join(BASE_DIR, "data", "chunks.json"),
)
EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 output size — must match decentrawood_routes


def index_chunks(chunks_json_path: str = CHUNKS_JSON_PATH,
                  collection_name: str = QDRANT_COLLECTION):
    # -----------------------------
    # Load chunks
    # -----------------------------
    text_chunks = load_json_chunks(chunks_json_path)
    print(f"Documents to index: {len(text_chunks)}")

    if not text_chunks:
        raise ValueError(f"No valid chunks loaded from {chunks_json_path} — aborting index rebuild.")

    # -----------------------------
    # Embeddings + shared Qdrant client
    # -----------------------------
    embeddings = download_embeddings()
    client = get_qdrant_client()

    # -----------------------------
    # Create fresh collection
    # -----------------------------
    existing = [c.name for c in client.get_collections().collections]
    if collection_name in existing:
        print(f"Deleting existing collection '{collection_name}'...")
        client.delete_collection(collection_name=collection_name)

    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
    )
    print(f"Created collection '{collection_name}'")

    before = client.count(collection_name=collection_name, exact=True)
    assert before.count == 0, (
        f"Collection '{collection_name}' is not empty after recreate "
        f"({before.count} stale points found). Delete the qdrant_db folder "
        f"manually and re-run."
    )

    # -----------------------------
    # Insert documents
    # -----------------------------
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )
    vector_store.add_documents(text_chunks)
    print(f"Documents indexed successfully: {len(text_chunks)}")

    # -----------------------------
    # Verify
    # -----------------------------
    after = client.count(collection_name=collection_name, exact=True)
    print(f"Qdrant points after insertion: {after.count}")

    assert after.count == len(text_chunks), (
        f"Expected {len(text_chunks)} points, found {after.count} — "
        f"some documents may have failed to insert."
    )


if __name__ == "__main__":
    index_chunks()