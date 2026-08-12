import re
from typing import Any
from conversation_dataclasses.models import ConversationContext
from session_memory import ConversationSessionState, SessionMemoryStore
from utils.logger import get_logger

logger = get_logger("conversation_manager")

PRONOUN_PATTERN = re.compile(r"\b(it|this|that|they|those|these|its|their|them|him|her)\b", re.IGNORECASE)

class ConversationManager:
    """Rewrite conversational follow-ups.
    
    Relies purely on generic entity extraction to track conversation state.
    Does not use any hardcoded topics or mappings.
    """

    # Generic named-entity extractor
    # Extracts the primary subject from a user query WITHOUT hardcoding any
    # entity names. Works by looking for noun phrases that follow common
    # trigger words ("about", "is", "are", "on", "in", etc.) and that
    # contain at least one uppercase letter.
    _ENTITY_TRIGGER = re.compile(
        r"(?:about|tell me about|what is|what are|explain|show me|open|how does|regarding)\s+([A-Z][A-Za-z0-9 \-\.]{1,40}?)(?:\s*[?.,!]|$)",
        re.IGNORECASE,
    )

    def __init__(self, memory_store: SessionMemoryStore | None = None, session_ttl_seconds: int = 3600):
        self.memory_store = memory_store or SessionMemoryStore(ttl_seconds=session_ttl_seconds)

    def process_query(self, session_id: str, user_query: str, chat_history: list[dict[str, Any]]) -> ConversationContext:
        normalized_query = " ".join(user_query.lower().strip().split())
        
        # 1. Extract entity from history
        active_entity = self._seed_state_from_history(chat_history)
        
        # 2. Extract entity from current query (overrides history if found)
        current_entity = self._extract_named_entity_from_query(user_query)
        if current_entity:
            active_entity = current_entity

        rewritten_query = user_query.strip()
        follow_up_detected = False

        # 3. Rewrite if it's a follow-up
        if active_entity:
            if PRONOUN_PATTERN.search(normalized_query) or self._needs_context(normalized_query):
                follow_up_detected = True
                rewritten_query = self._rewrite_with_subject(user_query, active_entity)
            elif self._is_short_follow_up(normalized_query):
                follow_up_detected = True
                rewritten_query = f"{user_query.strip()} about {active_entity}."

        logger.debug(
            "[ConvManager] session=%s original=%r rewritten=%r active_entity=%r follow_up=%s",
            session_id, user_query, rewritten_query, active_entity, follow_up_detected
        )

        # We return a simplified ConversationContext
        return ConversationContext(
            original_query=user_query,
            rewritten_query=rewritten_query,
            current_topic=active_entity,
            active_entity=active_entity,
            follow_up_detected=follow_up_detected,
            awaiting_confirmation=False,
            navigation_hint=None,
            clarification_required=False,
            metadata={"rewrite_reason": "follow_up" if follow_up_detected else "direct_query"},
        )

    def _seed_state_from_history(self, chat_history: list[dict[str, Any]]) -> str | None:
        """Finds the most recent named entity mentioned by the user."""
        for message in reversed(chat_history or []):
            if message.get("sender") == "user":
                entity = self._extract_named_entity_from_query(message.get("text") or "")
                if entity:
                    return entity
        return None

    def _extract_named_entity_from_query(self, text: str) -> str | None:
        stripped = text.strip()
        m = self._ENTITY_TRIGGER.search(stripped)
        if m:
            candidate = m.group(1).strip().rstrip("?.!")
            if re.search(r"[A-Z]", candidate):
                return candidate
        return None

    def _needs_context(self, text: str) -> bool:
        """Heuristic for very short phrases that need a subject."""
        words = text.split()
        if len(words) <= 3 and not self._extract_named_entity_from_query(text):
            # Things like "how much?", "is it good?", "tell me more"
            return True
        return False

    def _is_short_follow_up(self, text: str) -> bool:
        return text in {"more", "continue", "next", "why", "how", "tell me more", "explain"}

    def _rewrite_with_subject(self, original_query: str, subject: str) -> str:
        stripped = original_query.strip()
        lowered = stripped.lower()

        if lowered in {"how", "why"}:
            return f"How does {subject} work?" if lowered == "how" else f"Why {subject}?"
        if lowered in {"more", "continue", "next", "tell me more"}:
            return f"Tell me more about {subject}."
        if lowered in {"open it", "show it"}:
            return f"Open {subject} page."

        rewritten = PRONOUN_PATTERN.sub(subject, stripped)
        if rewritten != stripped:
            return self._ensure_sentence_terminal(rewritten, original_query)

        return f"{stripped} about {subject}."

    def _ensure_sentence_terminal(self, text: str, original_query: str) -> str:
        text = text[0].upper() + text[1:] if text else text
        if text.endswith((".", "?", "!")):
            return text
        if original_query.strip().endswith("?"):
            return f"{text}?"
        return f"{text}."
