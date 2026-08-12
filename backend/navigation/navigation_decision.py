from typing import Any, Dict, List

from config import ANSWER_THRESHOLD, NAVIGATION_MARGIN, NAVIGATION_THRESHOLD


def make_navigation_decision(
    answer_score: float,
    nav_routes: List[Dict[str, Any]],
    answer_threshold: float = ANSWER_THRESHOLD,
    nav_threshold: float = NAVIGATION_THRESHOLD,
    margin_threshold: float = NAVIGATION_MARGIN,
    rag_docs: List[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Evaluates answer_score and semantic route similarity scores to produce decision and navigation objects.
    Enforces strict thresholding with cross-validation for destination resolution.
    """
    if not nav_routes:
        return {
            "decision": {
                "type": "ANSWER",
                "answer_required": True,
                "navigation_required": False,
            },
            "navigation": {
                "should_navigate": False,
                "primary_route": None,
                "related_routes": [],
            },
        }

    effective_top = nav_routes[0]
    other_routes = nav_routes[1:]

    nav_top_score = effective_top.get("score", 0.0)
    nav_second_score = other_routes[0].get("score", 0.0) if other_routes else 0.0
    margin = nav_top_score - nav_second_score

    # Check if navigation confidence is sufficient and not ambiguous (sufficient margin)
    route_reliable = (nav_top_score >= nav_threshold) and (margin >= margin_threshold)

    # Destination Resolution: Cross-validate with RAG answers
    if not route_reliable and effective_top.get("url"):
        answer_urls = {doc.get("metadata", {}).get("url") for doc in (rag_docs or []) if doc.get("metadata", {}).get("url")}
        if effective_top.get("url") in answer_urls:
            route_reliable = True

    if not route_reliable:
        effective_top = None

    answer_req = answer_score >= answer_threshold
    
    if effective_top:
        is_internal_route = (effective_top.get("type") == "internal")
        should_nav = is_internal_route
        nav_req = True
    else:
        is_internal_route = False
        should_nav = False
        nav_req = False

    if answer_req and nav_req:
        decision_type = "BOTH"
    elif answer_req:
        decision_type = "ANSWER"
    elif nav_req:
        decision_type = "BOTH"  # If navigating without a good answer, still return BOTH to let frontend handle it
        answer_req = False
    else:
        # Neither a good answer nor a good route, but we still need to tell the LLM to try its best (Tier 2)
        decision_type = "ANSWER"
        answer_req = True
        nav_req = False
        should_nav = False

    primary_route = (
        {
            "route_id": effective_top.get("route_id"),
            "url": effective_top.get("url"),
            "route": effective_top.get("route"),
            "label": effective_top.get("title"),
            "type": effective_top.get("type", "internal"),
            "domain": effective_top.get("domain"),
            "confidence": round(nav_top_score, 4),
        }
        if effective_top
        else None
    )

    related_routes = [
        {
            "route_id": r.get("route_id"),
            "url": r.get("url"),
            "route": r.get("route"),
            "label": r.get("title"),
            "type": r.get("type", "internal"),
            "domain": r.get("domain"),
            "confidence": round(r.get("score", 0.0), 4),
        }
        for r in other_routes
        if r.get("score", 0.0) >= nav_threshold * 0.5
    ]

    return {
        "decision": {
            "type": decision_type,
            "answer_required": answer_req,
            "navigation_required": nav_req,
        },
        "navigation": {
            "type": "internal" if (should_nav and is_internal_route) else "external",
            "route": effective_top.get("route") if (should_nav and is_internal_route) else None,
            "should_navigate": should_nav,
            "primary_route": primary_route,
            "related_routes": related_routes,
        },
    }