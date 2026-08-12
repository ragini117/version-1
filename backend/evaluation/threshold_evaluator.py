"""
threshold_evaluator.py

Find the best semantic similarity threshold for the Decentrawood
knowledge base.

Inputs:
    data/chunks.json
    evaluation/threshold_queries.json

Outputs:
    evaluation/results/query_scores.csv
    evaluation/results/threshold_results.csv
    evaluation/results/threshold_report.json

Install:
    pip install sentence-transformers numpy pandas scikit-learn
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Change these only if your project structure is different.
KB_PATH = BASE_DIR / "data" / "chunks.json"
QUERY_PATH = BASE_DIR / "evaluation" / "threshold_queries.json"

RESULT_DIR = BASE_DIR / "evaluation" / "results"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# Threshold range to test.
THRESHOLD_START = 0.10
THRESHOLD_END = 0.80
THRESHOLD_STEP = 0.01

# Number of top KB chunks considered for each query.
TOP_K = 6


# ============================================================
# LOGGING
# ============================================================

def log(message: str) -> None:
    print(f"[THRESHOLD] {message}")


# ============================================================
# JSON LOADER
# ============================================================

def load_json(path: Path) -> Any:
    """
    Load JSON.

    Also handles simple // comments because some versions of the
    supplied Decentrawood KB contain commented lines.
    """

    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    text = path.read_text(encoding="utf-8")

    try:
        return json.loads(text)

    except json.JSONDecodeError:
        log(f"Standard JSON parsing failed for {path.name}")
        log("Trying to remove // comment lines...")

        cleaned_lines = []

        for line in text.splitlines():
            stripped = line.strip()

            if stripped.startswith("//"):
                continue

            cleaned_lines.append(line)

        cleaned_text = "\n".join(cleaned_lines)

        return json.loads(cleaned_text)


# ============================================================
# KNOWLEDGE BASE LOADER
# ============================================================

def load_knowledge_base(path: Path) -> list[dict[str, Any]]:
    data = load_json(path)

    if isinstance(data, dict):

        # Common possible structures.
        for key in ["chunks", "documents", "data", "items"]:
            if key in data and isinstance(data[key], list):
                data = data[key]
                break

    if not isinstance(data, list):
        raise ValueError(
            "Knowledge base must contain a JSON list of chunks."
        )

    valid_chunks = []

    for item in data:

        if not isinstance(item, dict):
            continue

        content = item.get("content")

        if not content:
            continue

        valid_chunks.append(item)

    if not valid_chunks:
        raise ValueError(
            "No valid chunks containing 'content' were found."
        )

    return valid_chunks


# ============================================================
# QUERY LOADER
# ============================================================

def load_test_queries(path: Path) -> list[dict[str, Any]]:
    data = load_json(path)

    if isinstance(data, dict):

        for key in ["queries", "data", "items"]:
            if key in data and isinstance(data[key], list):
                data = data[key]
                break

    if not isinstance(data, list):
        raise ValueError(
            "threshold_queries.json must contain a JSON list."
        )

    queries = []

    for index, item in enumerate(data, start=1):

        if not isinstance(item, dict):
            continue

        query = item.get("query")

        if not query:
            continue

        if "relevant" not in item:
            raise ValueError(
                f"Query #{index} is missing 'relevant': {query}"
            )

        queries.append(
            {
                "id": item.get("id", index),
                "query": str(query).strip(),
                "relevant": bool(item["relevant"]),
                "category": item.get("category", "unknown"),
            }
        )

    if not queries:
        raise ValueError("No valid test queries found.")

    return queries


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def clean_text(text: str) -> str:
    """
    Light normalization.

    We intentionally do NOT aggressively modify the text because
    the evaluator should represent the same semantic retrieval
    problem as the production RAG system.
    """

    text = str(text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ============================================================
# BUILD KB TEXT
# ============================================================

def build_chunk_text(chunk: dict[str, Any]) -> str:
    """
    Use the chunk's actual content for semantic similarity.

    Metadata is NOT mixed into the embedding text because the
    production retriever should primarily evaluate semantic
    relevance of the actual knowledge content.
    """

    return clean_text(chunk.get("content", ""))


# ============================================================
# COSINE SIMILARITY
# ============================================================

def cosine_similarity(
    query_embedding: np.ndarray,
    document_embeddings: np.ndarray,
) -> np.ndarray:

    query_norm = np.linalg.norm(query_embedding)

    document_norms = np.linalg.norm(
        document_embeddings,
        axis=1,
    )

    if query_norm == 0:
        return np.zeros(len(document_embeddings))

    denominator = query_norm * document_norms

    denominator = np.where(
        denominator == 0,
        1e-12,
        denominator,
    )

    scores = np.dot(
        document_embeddings,
        query_embedding,
    ) / denominator

    return scores


# ============================================================
# EMBEDDING
# ============================================================

def create_embeddings(
    model: SentenceTransformer,
    texts: list[str],
    description: str,
) -> np.ndarray:

    log(f"Embedding {len(texts)} {description}...")

    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )

    return embeddings


# ============================================================
# RETRIEVAL EVALUATION
# ============================================================

def calculate_query_scores(
    queries: list[dict[str, Any]],
    chunks: list[dict[str, Any]],
    query_embeddings: np.ndarray,
    chunk_embeddings: np.ndarray,
) -> pd.DataFrame:

    rows = []

    for i, query_data in enumerate(queries):

        query = query_data["query"]

        scores = cosine_similarity(
            query_embeddings[i],
            chunk_embeddings,
        )

        sorted_indices = np.argsort(scores)[::-1]

        top_indices = sorted_indices[:TOP_K]

        top_scores = scores[top_indices]

        max_score = float(top_scores[0])

        rows.append(
            {
                "id": query_data["id"],
                "query": query,
                "relevant": query_data["relevant"],
                "category": query_data["category"],
                "max_score": max_score,
                "top_1_score": float(top_scores[0]),
                "top_2_score": (
                    float(top_scores[1])
                    if len(top_scores) > 1
                    else None
                ),
                "top_3_score": (
                    float(top_scores[2])
                    if len(top_scores) > 2
                    else None
                ),
                "top_chunk_id": chunks[top_indices[0]].get(
                    "chunk_id",
                    ""
                ),
                "top_title": chunks[top_indices[0]].get(
                    "title",
                    ""
                ),
                "top_url": chunks[top_indices[0]].get(
                    "url",
                    ""
                ),
            }
        )

    return pd.DataFrame(rows)


# ============================================================
# THRESHOLD EVALUATION
# ============================================================

def evaluate_thresholds(
    scores_df: pd.DataFrame,
) -> pd.DataFrame:

    thresholds = np.arange(
        THRESHOLD_START,
        THRESHOLD_END + THRESHOLD_STEP / 2,
        THRESHOLD_STEP,
    )

    y_true = scores_df["relevant"].astype(int).to_numpy()

    results = []

    for threshold in thresholds:

        y_pred = (
            scores_df["max_score"].to_numpy() >= threshold
        ).astype(int)

        precision = precision_score(
            y_true,
            y_pred,
            zero_division=0,
        )

        recall = recall_score(
            y_true,
            y_pred,
            zero_division=0,
        )

        f1 = f1_score(
            y_true,
            y_pred,
            zero_division=0,
        )

        accuracy = accuracy_score(
            y_true,
            y_pred,
        )

        tn, fp, fn, tp = confusion_matrix(
            y_true,
            y_pred,
            labels=[0, 1],
        ).ravel()

        results.append(
            {
                "threshold": round(float(threshold), 4),
                "precision": round(float(precision), 4),
                "recall": round(float(recall), 4),
                "f1": round(float(f1), 4),
                "accuracy": round(float(accuracy), 4),
                "true_positive": int(tp),
                "true_negative": int(tn),
                "false_positive": int(fp),
                "false_negative": int(fn),
            }
        )

    return pd.DataFrame(results)


# ============================================================
# BEST THRESHOLD
# ============================================================

def select_best_threshold(
    results_df: pd.DataFrame,
) -> pd.Series:

    # F1 balances false positives and false negatives.
    #
    # If two thresholds have almost identical F1,
    # prefer the higher threshold because it reduces
    # irrelevant retrievals/hallucination risk.

    sorted_results = results_df.sort_values(
        by=[
            "f1",
            "precision",
            "recall",
        ],
        ascending=[
            False,
            False,
            False,
        ],
    )

    best = sorted_results.iloc[0]

    return best


# ============================================================
# SCORE DISTRIBUTION
# ============================================================

def print_score_distribution(
    scores_df: pd.DataFrame,
) -> None:

    relevant_scores = scores_df.loc[
        scores_df["relevant"] == True,
        "max_score",
    ]

    irrelevant_scores = scores_df.loc[
        scores_df["relevant"] == False,
        "max_score",
    ]

    print()
    print("=" * 70)
    print("SCORE DISTRIBUTION")
    print("=" * 70)

    if len(relevant_scores):

        print("\nRELEVANT QUERIES")
        print(
            f"Count : {len(relevant_scores)}"
        )
        print(
            f"Min   : {relevant_scores.min():.4f}"
        )
        print(
            f"Mean  : {relevant_scores.mean():.4f}"
        )
        print(
            f"Median: {relevant_scores.median():.4f}"
        )
        print(
            f"Max   : {relevant_scores.max():.4f}"
        )

    if len(irrelevant_scores):

        print("\nIRRELEVANT QUERIES")
        print(
            f"Count : {len(irrelevant_scores)}"
        )
        print(
            f"Min   : {irrelevant_scores.min():.4f}"
        )
        print(
            f"Mean  : {irrelevant_scores.mean():.4f}"
        )
        print(
            f"Median: {irrelevant_scores.median():.4f}"
        )
        print(
            f"Max   : {irrelevant_scores.max():.4f}"
        )


# ============================================================
# SHOW HARD CASES
# ============================================================

def print_hard_cases(
    scores_df: pd.DataFrame,
    threshold: float,
) -> None:

    df = scores_df.copy()

    df["predicted_relevant"] = (
        df["max_score"] >= threshold
    )

    false_positives = df[
        (df["relevant"] == False)
        & (df["predicted_relevant"] == True)
    ].sort_values(
        "max_score",
        ascending=False,
    )

    false_negatives = df[
        (df["relevant"] == True)
        & (df["predicted_relevant"] == False)
    ].sort_values(
        "max_score",
        ascending=True,
    )

    print()
    print("=" * 70)
    print("FALSE POSITIVES")
    print("=" * 70)

    if false_positives.empty:
        print("None")
    else:
        for _, row in false_positives.head(15).iterrows():

            print(
                f"\nScore: {row['max_score']:.4f}"
            )
            print(
                f"Query: {row['query']}"
            )
            print(
                f"Matched: {row['top_title']}"
            )
            print(
                f"Chunk: {row['top_chunk_id']}"
            )

    print()
    print("=" * 70)
    print("FALSE NEGATIVES")
    print("=" * 70)

    if false_negatives.empty:
        print("None")
    else:
        for _, row in false_negatives.head(15).iterrows():

            print(
                f"\nScore: {row['max_score']:.4f}"
            )
            print(
                f"Query: {row['query']}"
            )
            print(
                f"Matched: {row['top_title']}"
            )
            print(
                f"Chunk: {row['top_chunk_id']}"
            )


# ============================================================
# CATEGORY ANALYSIS
# ============================================================

def category_analysis(
    scores_df: pd.DataFrame,
    threshold: float,
) -> pd.DataFrame:

    rows = []

    for category, group in scores_df.groupby(
        "category"
    ):

        y_true = group["relevant"].astype(int)

        y_pred = (
            group["max_score"] >= threshold
        ).astype(int)

        rows.append(
            {
                "category": category,
                "queries": len(group),
                "precision": round(
                    precision_score(
                        y_true,
                        y_pred,
                        zero_division=0,
                    ),
                    4,
                ),
                "recall": round(
                    recall_score(
                        y_true,
                        y_pred,
                        zero_division=0,
                    ),
                    4,
                ),
                "f1": round(
                    f1_score(
                        y_true,
                        y_pred,
                        zero_division=0,
                    ),
                    4,
                ),
            }
        )

    return pd.DataFrame(rows).sort_values(
        "f1",
        ascending=False,
    )


# ============================================================
# REPORT
# ============================================================

def save_report(
    scores_df: pd.DataFrame,
    threshold_results: pd.DataFrame,
    best: pd.Series,
) -> None:

    best_threshold = float(
        best["threshold"]
    )

    category_df = category_analysis(
        scores_df,
        best_threshold,
    )

    report = {
        "model": MODEL_NAME,
        "knowledge_base": str(KB_PATH),
        "query_file": str(QUERY_PATH),
        "total_queries": int(len(scores_df)),
        "relevant_queries": int(
            scores_df["relevant"].sum()
        ),
        "irrelevant_queries": int(
            (~scores_df["relevant"]).sum()
        ),
        "top_k": TOP_K,
        "threshold_search": {
            "start": THRESHOLD_START,
            "end": THRESHOLD_END,
            "step": THRESHOLD_STEP,
        },
        "recommended_threshold": best_threshold,
        "metrics": {
            "precision": float(best["precision"]),
            "recall": float(best["recall"]),
            "f1": float(best["f1"]),
            "accuracy": float(best["accuracy"]),
            "true_positive": int(best["true_positive"]),
            "true_negative": int(best["true_negative"]),
            "false_positive": int(best["false_positive"]),
            "false_negative": int(best["false_negative"]),
        },
        "score_distribution": {
            "relevant_min": float(
                scores_df.loc[
                    scores_df["relevant"],
                    "max_score",
                ].min()
            ),
            "relevant_max": float(
                scores_df.loc[
                    scores_df["relevant"],
                    "max_score",
                ].max()
            ),
            "irrelevant_min": float(
                scores_df.loc[
                    ~scores_df["relevant"],
                    "max_score",
                ].min()
            ),
            "irrelevant_max": float(
                scores_df.loc[
                    ~scores_df["relevant"],
                    "max_score",
                ].max()
            ),
        },
        "category_results": category_df.to_dict(
            orient="records"
        ),
    }

    report_path = (
        RESULT_DIR / "threshold_report.json"
    )

    report_path.write_text(
        json.dumps(
            report,
            indent=2,
        ),
        encoding="utf-8",
    )


# ============================================================
# MAIN
# ============================================================

def main() -> None:

    print()
    print("=" * 70)
    print("DECENTRAWOOD RAG THRESHOLD EVALUATOR")
    print("=" * 70)

    RESULT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # --------------------------------------------------------
    # Check files
    # --------------------------------------------------------

    log(f"Knowledge base: {KB_PATH}")
    log(f"Queries:        {QUERY_PATH}")

    if not KB_PATH.exists():

        raise FileNotFoundError(
            f"\nKnowledge base not found:\n{KB_PATH}\n\n"
            "Change KB_PATH at the top of the script."
        )

    if not QUERY_PATH.exists():

        raise FileNotFoundError(
            f"\nQuery file not found:\n{QUERY_PATH}\n\n"
            "Make sure threshold_queries.json is inside "
            "the evaluation folder."
        )

    # --------------------------------------------------------
    # Load data
    # --------------------------------------------------------

    chunks = load_knowledge_base(
        KB_PATH
    )

    queries = load_test_queries(
        QUERY_PATH
    )

    log(
        f"Loaded {len(chunks)} KB chunks."
    )

    log(
        f"Loaded {len(queries)} test queries."
    )

    # --------------------------------------------------------
    # Load embedding model
    # --------------------------------------------------------

    log(
        f"Loading model: {MODEL_NAME}"
    )

    model = SentenceTransformer(
        MODEL_NAME
    )

    # --------------------------------------------------------
    # Prepare texts
    # --------------------------------------------------------

    chunk_texts = [
        build_chunk_text(chunk)
        for chunk in chunks
    ]

    query_texts = [
        query["query"]
        for query in queries
    ]

    # --------------------------------------------------------
    # Create embeddings
    # --------------------------------------------------------

    chunk_embeddings = create_embeddings(
        model,
        chunk_texts,
        "KB chunks",
    )

    query_embeddings = create_embeddings(
        model,
        query_texts,
        "test queries",
    )

    # --------------------------------------------------------
    # Calculate query scores
    # --------------------------------------------------------

    log("Calculating similarity scores...")

    scores_df = calculate_query_scores(
        queries,
        chunks,
        query_embeddings,
        chunk_embeddings,
    )

    # --------------------------------------------------------
    # Save individual scores
    # --------------------------------------------------------

    scores_path = (
        RESULT_DIR / "query_scores.csv"
    )

    scores_df.to_csv(
        scores_path,
        index=False,
        encoding="utf-8",
    )

    # --------------------------------------------------------
    # Evaluate thresholds
    # --------------------------------------------------------

    log(
        f"Testing thresholds "
        f"{THRESHOLD_START:.2f} → "
        f"{THRESHOLD_END:.2f}"
    )

    threshold_results = evaluate_thresholds(
        scores_df
    )

    threshold_path = (
        RESULT_DIR / "threshold_results.csv"
    )

    threshold_results.to_csv(
        threshold_path,
        index=False,
        encoding="utf-8",
    )

    # --------------------------------------------------------
    # Best threshold
    # --------------------------------------------------------

    best = select_best_threshold(
        threshold_results
    )

    best_threshold = float(
        best["threshold"]
    )

    # --------------------------------------------------------
    # Output
    # --------------------------------------------------------

    print_score_distribution(
        scores_df
    )

    print()
    print("=" * 70)
    print("RECOMMENDED THRESHOLD")
    print("=" * 70)

    print(
        f"Threshold : {best_threshold:.2f}"
    )

    print(
        f"Precision : {best['precision']:.4f}"
    )

    print(
        f"Recall    : {best['recall']:.4f}"
    )

    print(
        f"F1        : {best['f1']:.4f}"
    )

    print(
        f"Accuracy  : {best['accuracy']:.4f}"
    )

    print(
        f"True Pos. : {int(best['true_positive'])}"
    )

    print(
        f"True Neg. : {int(best['true_negative'])}"
    )

    print(
        f"False Pos.: {int(best['false_positive'])}"
    )

    print(
        f"False Neg.: {int(best['false_negative'])}"
    )

    # --------------------------------------------------------
    # Top thresholds
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("TOP 10 THRESHOLDS")
    print("=" * 70)

    display_columns = [
        "threshold",
        "precision",
        "recall",
        "f1",
        "false_positive",
        "false_negative",
    ]

    print(
        threshold_results
        .sort_values(
            "f1",
            ascending=False,
        )
        .head(10)[display_columns]
        .to_string(index=False)
    )

    # --------------------------------------------------------
    # Hard cases
    # --------------------------------------------------------

    print_hard_cases(
        scores_df,
        best_threshold,
    )

    # --------------------------------------------------------
    # Category results
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("CATEGORY PERFORMANCE")
    print("=" * 70)

    category_df = category_analysis(
        scores_df,
        best_threshold,
    )

    print(
        category_df.to_string(
            index=False
        )
    )

    # --------------------------------------------------------
    # Save report
    # --------------------------------------------------------

    save_report(
        scores_df,
        threshold_results,
        best,
    )

    # --------------------------------------------------------
    # Final paths
    # --------------------------------------------------------

    print()
    print("=" * 70)
    print("FILES CREATED")
    print("=" * 70)

    print(
        f"Query scores:\n{scores_path}"
    )

    print(
        f"\nThreshold results:\n{threshold_path}"
    )

    print(
        f"\nReport:\n"
        f"{RESULT_DIR / 'threshold_report.json'}"
    )

    print()
    print("=" * 70)
    print("DONE")
    print("=" * 70)

    print(
        "\nIMPORTANT:"
    )

    print(
        "Do NOT blindly copy the recommended threshold "
        "into production yet."
    )

    print(
        "First inspect the false positives and false "
        "negatives above."
    )


if __name__ == "__main__":
    main()