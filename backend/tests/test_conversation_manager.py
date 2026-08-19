import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.conversation_manager import ConversationManager
from infrastructure.external.openai_client import get_openai_client

@pytest.fixture
def manager():
    return ConversationManager()

def test_follow_up_resolution_games(manager):
    # 1. "What games are available?" -> "Which one has 100 levels?" -> DEOD HUNT
    history = [
        {"sender": "user", "text": "What games are available?"},
        {"sender": "assistant", "text": "Decentrawood offers several games including DEOD HUNT and Cupid Hub."}
    ]
    query = "Which one has 100 levels?"
    
    ctx = manager.process_query("test_sess", query, history)
    
    # "Which Decentrawood game has 100 levels?" or something similar
    assert "game" in ctx.rewritten_query.lower() or "deod hunt" in ctx.rewritten_query.lower() or "cupid hub" in ctx.rewritten_query.lower()
    assert ctx.follow_up_detected is True

def test_follow_up_resolution_deod_hunt(manager):
    # 2. "Tell me about DEOD HUNT." -> "How many levels does it have?" -> 100
    history = [
        {"sender": "user", "text": "Tell me about DEOD HUNT."},
        {"sender": "assistant", "text": "DEOD HUNT is a battle royale game set in Decentrawood."}
    ]
    query = "How many levels does it have?"
    
    ctx = manager.process_query("test_sess", query, history)
    
    assert "deod hunt" in ctx.rewritten_query.lower()
    assert ctx.follow_up_detected is True

def test_follow_up_resolution_governance(manager):
    # 3. "What is DEOD used for?" -> "Can I use it for governance too?" -> existing behavior
    history = [
        {"sender": "user", "text": "What is DEOD used for?"},
        {"sender": "assistant", "text": "DEOD is the native utility token."}
    ]
    query = "Can I use it for governance too?"
    
    ctx = manager.process_query("test_sess", query, history)
    
    assert "deod" in ctx.rewritten_query.lower()
    assert ctx.follow_up_detected is True

def test_follow_up_resolution_gta6(manager):
    # 4. "What games are available?" -> "What is GTA 6?" -> OUT_OF_DOMAIN
    history = [
        {"sender": "user", "text": "What games are available?"},
        {"sender": "assistant", "text": "Decentrawood offers several games including DEOD HUNT."}
    ]
    query = "What is GTA 6?"
    
    ctx = manager.process_query("test_sess", query, history)
    
    # "What is GTA 6?" does not need much rewriting, or maybe it becomes "What is the game GTA 6?"
    # The key is that it shouldn't force an in-domain resolution incorrectly.
    assert "gta 6" in ctx.rewritten_query.lower()
    
