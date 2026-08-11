import json
import os
import sys
 
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
 
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from Rag.helper import download_embeddings  # noqa: E402
from Rag.vector_store import get_qdrant_client  # noqa: E402
 
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
 
ROUTES_ENRICHED_PATH = os.getenv("ROUTES_ENRICHED_PATH", os.path.join(_THIS_DIR, "..", "data", "routes_enriched.json"))
NAVIGATION_COLLECTION = os.getenv("NAVIGATION_COLLECTION", "decentrawood_routes")
EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 output size — must match decentrawood_docs
 
 
# Broad summary/index-style pages (e.g. "What is Decentrawood?") legitimately
# mention many features (gaming, AI, DAO, music) in their full description.
# Using that full text for EMBEDDING makes them falsely dominate navigation
# for queries about any single feature they merely mention in passing. We
# keep the full, accurate description for display/storage, but cap how much
# of it feeds the embedding for known broad-overview routes specifically.
_EMBEDDING_DESCRIPTION_MAX_WORDS = {
    "what_is_decentrawood": 12,
    "home": 12,
}


def _build_embedding_text(route: dict) -> str:
    description = route.get("description", "")
    max_words = _EMBEDDING_DESCRIPTION_MAX_WORDS.get(route.get("route_id"))
    if max_words:
        description = " ".join(description.split()[:max_words])

    parts = [
        route["title"],
        description,
        " ".join(route.get("aliases", [])),
        " ".join(route.get("example_queries", [])),
    ]
    return " . ".join(p for p in parts if p)
 
 
def load_enriched_routes(path: str) -> list:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
 
 
def embed_routes(routes_enriched_path: str = ROUTES_ENRICHED_PATH,
                  collection_name: str = NAVIGATION_COLLECTION):
    routes = load_enriched_routes(routes_enriched_path)
    print(f"Loaded {len(routes)} enriched routes from {routes_enriched_path}")
 
    embedding_model = download_embeddings()
 
    client = get_qdrant_client()
 
    existing = [c.name for c in client.get_collections().collections]
    if collection_name in existing:
        print(f"Deleting existing collection '{collection_name}'...")
        client.delete_collection(collection_name=collection_name)
 
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
    )
    print(f"Created collection '{collection_name}'")
 
    texts = [_build_embedding_text(r) for r in routes]
    vectors = embedding_model.embed_documents(texts)
 
    points = []
    for idx, (route, vector) in enumerate(zip(routes, vectors)):
        points.append(
            PointStruct(
                id=idx,
                vector=vector,
                payload={
                    "page_content": texts[idx],
                    "metadata": {
                        "route_id": route["route_id"],
                        "title": route["title"],
                        "url": route["url"],
                        "route": route.get("route"),
                        "domain": route.get("domain"),
                        "type": route.get("type"),
                        "needs_review": route.get("needs_review", False),
                    },
                },
            )
        )

 
    client.upsert(collection_name=collection_name, points=points)
 
    count = client.count(collection_name=collection_name, exact=True)
    print(f"Indexed {count.count} routes into '{collection_name}'")
 
    assert count.count == len(routes), (
        f"Expected {len(routes)} points, found {count.count} — "
        f"collection may not have been fully clean before insertion."
    )
 
    client.close()
 
 
if __name__ == "__main__":
    embed_routes()