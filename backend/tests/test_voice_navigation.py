import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from navigation.navigation_decision import make_navigation_decision
from voice.navigation import apply_voice_navigation_policy


def test_voice_mode_disables_navigation_decision():
    nav_routes = [{
        "route_id": "r1",
        "title": "About",
        "url": "/about",
        "route": "/about",
        "type": "internal",
        "domain": "decentrawood.com",
        "score": 0.9,
    }]

    decision_obj = make_navigation_decision(
        answer_score=0.9,
        nav_routes=nav_routes,
        voice_mode=True,
    )

    assert decision_obj["navigation"]["should_navigate"] is False
    assert decision_obj["navigation"]["primary_route"] is None
    assert decision_obj["decision"]["navigation_required"] is False


def test_apply_voice_navigation_policy_strips_cached_navigation():
    cached_result = {
        "response_text": "Decentrawood is a Web3 metaverse.",
        "intent": "about",
        "confidence": 0.95,
        "navigate_to": "/about",
        "decision": {
            "type": "BOTH",
            "answer_required": True,
            "navigation_required": True,
        },
        "navigation": {
            "should_navigate": True,
            "type": "internal",
            "route": "/about",
            "primary_route": {
                "url": "/about",
                "label": "About",
                "type": "internal",
                "confidence": 0.9,
            },
            "related_routes": [],
        },
    }

    voice_result = apply_voice_navigation_policy(cached_result)

    assert cached_result["navigate_to"] == "/about"
    assert cached_result["navigation"]["should_navigate"] is True
    assert voice_result["navigate_to"] is None
    assert voice_result["navigation"]["should_navigate"] is False
    assert voice_result["navigation"]["primary_route"] is None
    assert voice_result["decision"]["navigation_required"] is False
    assert voice_result["decision"]["type"] == "ANSWER"
