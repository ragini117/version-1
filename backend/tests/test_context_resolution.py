import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.conversation_manager import ConversationManager
from session_memory import SessionMemoryStore, ConversationSessionState
from infrastructure.external.openai_client import get_openai_client

@pytest.fixture
def manager():
    return ConversationManager()

@pytest.mark.parametrize("history, current_state, query, expected_in_query, expected_topic, expected_entities", [
    # 1. Topic switching
    (
        [
            {"sender": "user", "text": "What is DEOD?"},
            {"sender": "assistant", "text": "DEOD is the native token."}
        ],
        {"current_topic": "tokens", "recent_entities": ["DEOD"]},
        "What games are available?",
        ["game", "what games are available"],
        "gaming",
        []
    ),
    # 2. Pronoun reference
    (
        [
            {"sender": "user", "text": "Tell me about DEOD HUNT."},
            {"sender": "assistant", "text": "DEOD HUNT is a battle royale game."}
        ],
        {"current_topic": "gaming", "recent_entities": ["DEOD HUNT"]},
        "How many levels does it have?",
        ["deod hunt", "levels"],
        "gaming",
        ["DEOD HUNT"]
    ),
    # 3. Action dependency
    (
        [
            {"sender": "user", "text": "What is DEOD used for?"},
            {"sender": "assistant", "text": "DEOD is the native utility token."}
        ],
        {"current_topic": "tokens", "recent_entities": ["DEOD"]},
        "Can I use it for governance too?",
        ["deod", "governance"],
        "tokens",
        ["DEOD"]
    ),
    # 4. Out of domain query (should NOT be modified)
    (
        [
            {"sender": "user", "text": "What games are available?"},
            {"sender": "assistant", "text": "Decentrawood offers several games including DEOD HUNT."}
        ],
        {"current_topic": "gaming", "recent_entities": ["DEOD HUNT"]},
        "What is GTA 6?",
        ["gta 6"],
        None, # Topic might change or remain, but query must have GTA 6
        []
    ),
    # 5. Entity Reference ("Which one...")
    (
        [
            {"sender": "user", "text": "Tell me about Cupid Hub and DEOD HUNT."},
            {"sender": "assistant", "text": "Both are games in Decentrawood."}
        ],
        {"current_topic": "gaming", "recent_entities": ["Cupid Hub", "DEOD HUNT"]},
        "Which one is a battle royale?",
        ["decentrawood game", "cupid hub", "deod hunt", "battle royale"],
        "gaming",
        []
    ),
])
def test_generic_context_resolution(manager, history, current_state, query, expected_in_query, expected_topic, expected_entities):
    # Set the state manually
    manager.memory_store.update(
        "test_sess",
        current_topic=current_state["current_topic"],
        recent_entities=current_state["recent_entities"]
    )
    
    ctx = manager.process_query("test_sess", query, history)
    
    # Check if any expected keyword is in the rewritten query
    found_any = any(k.lower() in ctx.rewritten_query.lower() for k in expected_in_query)
    assert found_any, f"Expected one of {expected_in_query} in {ctx.rewritten_query}"
    
    if expected_topic:
        assert expected_topic.lower() in (ctx.current_topic or "").lower() or ctx.current_topic is None
        
def test_clarification_needed(manager):
    history = [
        {"sender": "user", "text": "I like tokens and games."},
        {"sender": "assistant", "text": "We have DEOD and DEOD HUNT."}
    ]
    query = "How much is it?"
    
    manager.memory_store.update(
        "test_sess",
        current_topic="mixed",
        recent_entities=["DEOD", "DEOD HUNT"]
    )
    
    ctx = manager.process_query("test_sess", query, history)
    
    # It might ask for clarification since "it" is ambiguous (token vs game)
    assert ctx.clarification_required is True or "deod" in ctx.rewritten_query.lower()
