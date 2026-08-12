import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from navigation.navigation_decision import make_navigation_decision

def test_internal_route_auto_navigation():
    nav_routes = [{
        "route_id": "r1",
        "title": "About",
        "url": "/about",
        "route": "/about",
        "type": "internal",
        "domain": "decentrawood.com",
        "score": 0.8
    }]
    decision_obj = make_navigation_decision(
        answer_score=0.9,
        nav_routes=nav_routes,
        answer_threshold=0.5,
        nav_threshold=0.4,
        margin_threshold=0.01,
        rag_docs=[]
    )
    assert decision_obj["decision"]["type"] == "BOTH"
    assert decision_obj["navigation"]["should_navigate"] is True
    assert decision_obj["navigation"]["type"] == "internal"
    assert decision_obj["navigation"]["primary_route"]["url"] == "/about"

def test_external_route_no_auto_navigation():
    nav_routes = [{
        "route_id": "r2",
        "title": "DEOD AI",
        "url": "https://deod.ai",
        "route": "https://deod.ai",
        "type": "external_subdomain",
        "domain": "deod.ai",
        "score": 0.8
    }]
    decision_obj = make_navigation_decision(
        answer_score=0.9,
        nav_routes=nav_routes,
        answer_threshold=0.5,
        nav_threshold=0.4,
        margin_threshold=0.01,
        rag_docs=[]
    )
    # Even with high score, should not auto navigate because it's external
    assert decision_obj["navigation"]["should_navigate"] is False
    assert decision_obj["navigation"]["primary_route"]["type"] == "external_subdomain"
    assert decision_obj["navigation"]["primary_route"]["url"] == "https://deod.ai"

def test_no_reliable_route():
    nav_routes = [{
        "route_id": "r3",
        "title": "Unrelated",
        "url": "/unrelated",
        "route": "/unrelated",
        "type": "internal",
        "domain": "decentrawood.com",
        "score": 0.2 # Below threshold
    }]
    decision_obj = make_navigation_decision(
        answer_score=0.9,
        nav_routes=nav_routes,
        answer_threshold=0.5,
        nav_threshold=0.4,
        margin_threshold=0.01,
        rag_docs=[]
    )
    assert decision_obj["navigation"]["should_navigate"] is False
    assert decision_obj["navigation"]["primary_route"] is None

def test_destination_resolver_cross_validation():
    nav_routes = [{
        "route_id": "r4",
        "title": "Cross Validated",
        "url": "https://deod.ai/docs",
        "route": "https://deod.ai/docs",
        "type": "external_subdomain",
        "domain": "deod.ai",
        "score": 0.3 # Below threshold!
    }]
    rag_docs = [{
        "metadata": {
            "url": "https://deod.ai/docs"
        }
    }]
    decision_obj = make_navigation_decision(
        answer_score=0.9,
        nav_routes=nav_routes,
        answer_threshold=0.5,
        nav_threshold=0.4,
        margin_threshold=0.01,
        rag_docs=rag_docs
    )
    # Should be reliable due to cross validation, but still no auto nav since it's external
    assert decision_obj["navigation"]["should_navigate"] is False
    assert decision_obj["navigation"]["primary_route"]["url"] == "https://deod.ai/docs"
    assert decision_obj["navigation"]["primary_route"]["type"] == "external_subdomain"
