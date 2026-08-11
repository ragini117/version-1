from __future__ import annotations

import copy
import threading
import time
from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class ConversationSessionState:
    """Lightweight per-session conversation memory.

    This stores conversational state only. It intentionally does not store
    embeddings, retrieved documents, or MongoDB history records.
    """

    current_topic: str | None = None
    active_entity: str | None = None
    last_user_query: str = ""
    last_assistant_message: str = ""
    awaiting_confirmation: bool = False
    pending_topic: str | None = None
    recent_entities: list[str] = field(default_factory=list)
    last_navigation: str | None = None
    timestamp: float = field(default_factory=time.monotonic)
    metadata: dict[str, Any] = field(default_factory=dict)


class SessionMemoryStore:
    """In-memory session store with TTL-based expiration.

    The store is intentionally simple so it can be swapped out later for Redis
    or another cache without changing the conversation manager API.
    """

    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self._lock = threading.RLock()
        self._sessions: dict[str, ConversationSessionState] = {}

    def _is_expired(self, state: ConversationSessionState) -> bool:
        return (time.monotonic() - state.timestamp) > self.ttl_seconds

    def _purge_if_expired(self, session_id: str) -> None:
        state = self._sessions.get(session_id)
        if state is not None and self._is_expired(state):
            self._sessions.pop(session_id, None)

    def get(self, session_id: str) -> ConversationSessionState | None:
        with self._lock:
            self._purge_if_expired(session_id)
            state = self._sessions.get(session_id)
            return copy.deepcopy(state) if state is not None else None

    def set(self, session_id: str, state: ConversationSessionState) -> ConversationSessionState:
        with self._lock:
            state.timestamp = time.monotonic()
            self._sessions[session_id] = copy.deepcopy(state)
            return copy.deepcopy(state)

    def update(self, session_id: str, **updates: Any) -> ConversationSessionState:
        with self._lock:
            state = self._sessions.get(session_id) or ConversationSessionState()
            for key, value in updates.items():
                if hasattr(state, key):
                    setattr(state, key, value)
                else:
                    state.metadata[key] = value
            state.timestamp = time.monotonic()
            self._sessions[session_id] = copy.deepcopy(state)
            return copy.deepcopy(state)

    def clear(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)