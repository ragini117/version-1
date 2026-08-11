from typing import Any, Dict, List

from config import ANSWER_THRESHOLD, NAVIGATION_MARGIN, NAVIGATION_THRESHOLD


def make_navigation_decision(
    answer_score: float,
    nav_routes: List[Dict[str, Any]],
    answer_threshold: float = ANSWER_THRESHOLD,
    nav_threshold: float = NAVIGATION_THRESHOLD,
    margin_threshold: float = NAVIGATION_MARGIN,
) -> Dict[str, Any]:
    """
    Evaluates answer_score and semantic route similarity scores to produce decision and navigation objects.
    Enforces strict thresholding with no fuzzy fallbacks.
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
    strong_nav = (nav_top_score >= nav_threshold) and (margin >= margin_threshold)

    # Single Source of Truth: Check exact Qdrant metadata 'type'
    is_internal_route = (effective_top.get("type") == "internal")

    # External routes (type != "internal") MUST NEVER auto-navigate
    if not is_internal_route:
        strong_nav = False

    # The decision is simple:
    # If we have an answer score >= threshold, we always provide an answer.
    # If strong_nav is True, we also navigate.
    answer_req = answer_score >= answer_threshold
    nav_req = strong_nav
    should_nav = strong_nav

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
            "type": "internal" if is_internal_route else "external",
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
            "type": "internal" if r.get("type") == "internal" else "external",
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