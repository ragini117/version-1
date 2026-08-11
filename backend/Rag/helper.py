from typing import List
from functools import lru_cache
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
import json

REQUIRED_CHUNK_FIELDS = ["chunk_id", "document_id", "content"]


def load_json_chunks(json_path: str) -> List[Document]:
    with open(json_path, "r", encoding="utf-8") as f:
        raw_chunks = json.load(f)

    if not isinstance(raw_chunks, list):
        raise ValueError(f"Expected a list of chunk objects in {json_path}, got {type(raw_chunks)}")

    documents = []
    skipped = 0

    for chunk in raw_chunks:
        missing = [field for field in REQUIRED_CHUNK_FIELDS if not chunk.get(field)]
        if missing:
            skipped += 1
            print(f"[WARN] Skipping chunk (missing {missing}): {chunk.get('chunk_id', '<no id>')}")
            continue

        content_text = chunk["content"]
        chunk_url = chunk.get("url")
        if chunk_url and chunk_url not in content_text:
            content_text = f"{content_text}\nOfficial URL: {chunk_url}"

        documents.append(
            Document(
                page_content=content_text,
                metadata={
                    "chunk_id": chunk.get("chunk_id"),
                    "document_id": chunk.get("document_id"),
                    "title": chunk.get("title"),
                    "section": chunk.get("section"),
                    "category": chunk.get("category"),
                    "domain": chunk.get("domain"),
                    "url": chunk.get("url"),
                    "route": chunk.get("route"),
                    # Chroma-style stores reject list-typed metadata values;
                    # keep this a plain string so the loader stays safe
                    # regardless of which vector store consumes it later.
                    "keywords": ", ".join(chunk.get("keywords", []) or []),
                    "source_type": "json_kb",
                },
            )
        )

    print(f"Loaded {len(documents)} chunks from {json_path} ({skipped} skipped)")
    return documents


# =====================================================
# EMBEDDINGS
# =====================================================

@lru_cache(maxsize=1)
def download_embeddings():

    model_name = "sentence-transformers/all-MiniLM-L6-v2"

    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={
            "device": "cpu"
        },
        encode_kwargs={
            "normalize_embeddings": True
        }
    )

    return embeddings