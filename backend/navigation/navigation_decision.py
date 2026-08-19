from typing import Any, Dict, List

from config import ANSWER_THRESHOLD, NAVIGATION_MARGIN, NAVIGATION_THRESHOLD


def make_navigation_decision(
    answer_score: float,
    nav_routes: List[Dict[str, Any]],
    answer_threshold: float = ANSWER_THRESHOLD,
    nav_threshold: float = NAVIGATION_THRESHOLD,
    margin_threshold: float = NAVIGATION_MARGIN,
    rag_docs: List[Dict[str, Any]] = None,
    voice_mode: bool = False,
) -> Dict[str, Any]:

    # ---------------------------------------------------------
    # 1. VOICE MODE = NEVER NAVIGATE
    # ---------------------------------------------------------
    if voice_mode:
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
                "type": "none",
                "route": None,
            },
        }

    # ---------------------------------------------------------
    # 2. NO NAVIGATION CANDIDATES = NO NAVIGATION
    # ---------------------------------------------------------
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
                "type": "none",
                "route": None,
            },
        }

    # ---------------------------------------------------------
    # 3. GET URLS ACTUALLY PRESENT IN RAG RESULTS
    #    Normalize by stripping trailing slashes so https://deod.ai/
    #    matches a route with url https://deod.ai
    # ---------------------------------------------------------
    answer_urls = {
        doc.get("metadata", {}).get("url", "").rstrip("/")
        for doc in (rag_docs or [])
        if doc.get("metadata", {}).get("url")
    }

    # ---------------------------------------------------------
    # 4. ONLY ACCEPT ROUTES WHOSE URL EXISTS IN RAG RESULTS
    #    Exception 1: External routes rely purely on semantic score.
    #    Exception 2: Internal routes with highly confident semantic 
    #                 match (score >= 0.60) bypass RAG requirement.
    # ---------------------------------------------------------
    matched_routes = [
        route
        for route in nav_routes
        if (
            route.get("url", "").rstrip("/") in answer_urls 
            or route.get("type", "internal") != "internal"
            or route.get("score", 0.0) >= 0.60
        )
    ]

    if not matched_routes:
        answer_req = answer_score >= answer_threshold

        return {
            "decision": {
                "type": "ANSWER",
                "answer_required": answer_req or True,
                "navigation_required": False,
            },
            "navigation": {
                "should_navigate": False,
                "primary_route": None,
                "related_routes": [],
                "type": "none",
                "route": None,
            },
        }

    # ---------------------------------------------------------
    # 5. SELECT BEST MATCH ONLY FROM VALID RAG-MATCHED ROUTES
    # ---------------------------------------------------------
    effective_top = max(
        matched_routes,
        key=lambda route: route.get("score", 0.0)
    )

    # ---------------------------------------------------------
    # 6. OTHER VALID MATCHED ROUTES
    # ---------------------------------------------------------
    other_routes = [
        route
        for route in matched_routes
        if route is not effective_top
    ]

    nav_top_score = effective_top.get("score", 0.0)

    nav_second_score = (
        other_routes[0].get("score", 0.0)
        if other_routes
        else 0.0
    )

    margin = nav_top_score - nav_second_score

    # ---------------------------------------------------------
    # 7. ROUTE CONFIDENCE
    #
    # External routes (open in new tab, no auto-navigation) do NOT
    # require a wide margin — the tight margin guard exists to prevent
    # confidently navigating the user to the WRONG internal page.
    # For external routes the worst case is showing a slightly-less-
    # relevant link card, which is far less disruptive.
    # ---------------------------------------------------------
    is_effective_external = (
        effective_top.get("type", "internal") != "internal"
    )

    if is_effective_external:
        # External routes: only require minimum score threshold, no margin gate
        route_reliable = nav_top_score >= nav_threshold
    else:
        # Internal routes: require both score AND clear margin over runner-up
        route_reliable = (
            nav_top_score >= nav_threshold
            and margin >= margin_threshold
        )

    if not route_reliable:
        effective_top = None

    # ---------------------------------------------------------
    # 8. ANSWER DECISION
    # ---------------------------------------------------------
    answer_req = answer_score >= answer_threshold

    if effective_top:

        is_internal_route = (
            effective_top.get("type") == "internal"
        )

        # Only internal routes auto-navigate.
        should_nav = is_internal_route
        nav_req = True

    else:

        is_internal_route = False
        should_nav = False
        nav_req = False

    # ---------------------------------------------------------
    # 9. DECISION TYPE
    # ---------------------------------------------------------
    if answer_req and nav_req:
        decision_type = "BOTH"

    elif answer_req:
        decision_type = "ANSWER"

    elif nav_req:
        decision_type = "BOTH"
        answer_req = False

    else:
        decision_type = "ANSWER"
        answer_req = True
        nav_req = False
        should_nav = False

    # ---------------------------------------------------------
    # 10. PRIMARY ROUTE
    # ---------------------------------------------------------
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

    # ---------------------------------------------------------
    # 11. RELATED ROUTES
    #
    # IMPORTANT:
    # Only show routes that are ALSO matched against RAG URLs.
    # ---------------------------------------------------------
    related_routes = [
        {
            "route_id": route.get("route_id"),
            "url": route.get("url"),
            "route": route.get("route"),
            "label": route.get("title"),
            "type": route.get("type", "internal"),
            "domain": route.get("domain"),
            "confidence": round(
                route.get("score", 0.0), 4
            ),
        }
        for route in other_routes
        if route.get("score", 0.0) >= nav_threshold * 0.5
    ]

    # ---------------------------------------------------------
    # 12. FINAL RESPONSE
    # ---------------------------------------------------------
    return {
        "decision": {
            "type": decision_type,
            "answer_required": answer_req,
            "navigation_required": nav_req,
        },
        "navigation": {
            "type": (
                "internal"
                if should_nav and is_internal_route
                else "none"
            ),
            "route": (
                effective_top.get("route")
                if should_nav and is_internal_route
                else None
            ),
            "should_navigate": should_nav,
            "primary_route": primary_route,
            "related_routes": related_routes,
        },
    }