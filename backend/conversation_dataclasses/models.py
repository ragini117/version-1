from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class ConversationContext:
    """Structured result produced by the conversation manager.

    The context manager never answers the user. It only rewrites the incoming
    query and exposes lightweight state that the rest of the chatbot can use.
    """

    original_query: str
    rewritten_query: str
    current_topic: str | None = None
    active_entity: str | None = None
    referenced_entities: list[str] = field(default_factory=list)
    intent: str | None = None
    follow_up_detected: bool = False
    awaiting_confirmation: bool = False
    navigation_hint: str | None = None
    clarification_required: bool = False
    metadata: dict[str, Any] = field(default_factory=dict)