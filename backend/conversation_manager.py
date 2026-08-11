from __future__ import annotations

import re
from difflib import get_close_matches
from dataclasses import dataclass
from typing import Any, Iterable

from conversation_dataclasses.models import ConversationContext
from session_memory import ConversationSessionState, SessionMemoryStore
from utils.logger import get_logger


logger = get_logger("conversation_manager")


@dataclass(frozen=True, slots=True)
class TopicDefinition:
    topic: str
    active_entity: str
    navigation_hint: str
    aliases: tuple[str, ...] = ()


TOPIC_DEFINITIONS: tuple[TopicDefinition, ...] = (
    TopicDefinition("DEOD Token", "DEOD token", "token", ("deod token", "deod", "token", "deod_token")),
    TopicDefinition("Decentrawood Overview", "Decentrawood platform", "what_is_decentrawood", ("decentrawood", "decentrawood platform", "overview")),
    TopicDefinition("Staking", "DEOD Staking", "staking", ("staking", "stake", "stake deod")),
    TopicDefinition("DAO", "Decentrawood DAO", "dao", ("dao", "governance", "voting")),
    TopicDefinition("AI", "Decentrawood AI Studio", "ai", ("ai studio", "ai assistant", "ai page", "artificial intelligence", "ai")),
    TopicDefinition("Gaming", "Decentrawood Gaming", "game", ("gaming", "games", "game page", "games page", "game section", "play as guest", "play game", "game")),
    TopicDefinition("Marketplace", "Decentrawood Marketplace", "marketplace", ("marketplace", "market place", "market dashboard", "market")),
    TopicDefinition("Analytics Hub", "Decentrawood Analytics Hub", "analytics_hub", ("analytics hub", "analytics")),
    TopicDefinition("Workflow Engine", "Decentrawood Workflow Engine", "workflow_engine", ("workflow engine", "workflow", "automation workflow")),
    TopicDefinition("Cloud Sync", "Decentrawood Cloud Sync", "cloud_sync", ("cloud sync", "sync", "cloud")),
    TopicDefinition("Culture Zone", "Decentrawood Culture Zone", "culture_zone", ("culture zone", "culture")),
    TopicDefinition("Glamour Zone", "Decentrawood Glamour Zone", "glamour_zone", ("glamour zone", "glamour")),
    TopicDefinition("Secure Vault", "Decentrawood Secure Vault", "secure_vault", ("secure vault", "vault", "security vault")),
    TopicDefinition("DataBridge Pro", "Decentrawood DataBridge Pro", "databridge_pro", ("databridge pro", "databridge", "bridge")),
    TopicDefinition("Billing", "Decentrawood Billing Plans", "billing", ("billing", "billing plans", "pricing", "plan", "plans")),
    TopicDefinition("Authentication", "Decentrawood Authentication", "authentication", ("authentication", "auth", "login", "sign in", "sign up")),
    TopicDefinition("Performance", "Decentrawood Performance", "performance", ("performance", "speed", "optimization")),
    TopicDefinition("Integrations", "Decentrawood Integrations", "integrations", ("integrations", "integration", "integrate")),
    TopicDefinition("Toobit", "Toobit exchange", "toobit", ("toobit", "toolbit", "toobit exchange", "centralized exchange", "exchange")),
)


AFFIRMATIVE_RESPONSES = {
    "yes",
    "yeah",
    "yep",
    "yup",
    "ok",
    "okay",
    "sure",
    "continue",
    "more",
    "next",
}

NEGATIVE_RESPONSES = {"no", "nope", "nah"}

SHORT_FOLLOW_UP_PHRASES = (
    "tell me more",
    "explain more",
    "what about it",
    "and then",
    "open it",
    "show it",
    "more",
    "continue",
    "next",
    "why",
    "how",
)

PRONOUN_PATTERN = re.compile(r"\b(it|this|that|they|those|these|its|their|them|him|her)\b", re.IGNORECASE)


class ConversationManager:
    """Rewrite conversational follow-ups before they reach intent detection.

    The manager is intentionally independent from RAG and response generation.
    Its job is to preserve conversational context, resolve short replies and
    pronouns, and keep a lightweight session memory.
    """

    def __init__(self, memory_store: SessionMemoryStore | None = None, session_ttl_seconds: int = 3600):
        self.memory_store = memory_store or SessionMemoryStore(ttl_seconds=session_ttl_seconds)

    def process_query(self, session_id: str, user_query: str, chat_history: list[dict[str, Any]]) -> ConversationContext:
        normalized_query = self._normalize(user_query)
        history_state = self._seed_state_from_history(chat_history)
        memory_state = self.memory_store.get(session_id) or ConversationSessionState()

        current_topic = memory_state.current_topic or history_state.current_topic
        active_entity = memory_state.active_entity or history_state.active_entity
        awaiting_confirmation = memory_state.awaiting_confirmation or history_state.awaiting_confirmation
        pending_topic = memory_state.pending_topic or history_state.pending_topic
        last_navigation = memory_state.last_navigation or history_state.last_navigation
        rewritten_query = user_query.strip()
        follow_up_detected = False
        clarification_required = False
        navigation_hint = None
        matched_topic = self._detect_topic(normalized_query)
        matched_topic_source = None

        if current_topic and active_entity is None:
            active_entity = self._default_entity_for_topic(current_topic)

        if matched_topic is not None:
            matched_topic_source = matched_topic.topic
            if matched_topic.topic != current_topic:
                logger.debug("Topic changed for session %s: %s -> %s", session_id, current_topic, matched_topic.topic)
            current_topic = matched_topic.topic
            active_entity = matched_topic.active_entity
            navigation_hint = matched_topic.navigation_hint
            pending_topic = None

        if self._is_confirmation(normalized_query):
            follow_up_detected = True
            if self._is_affirmative(normalized_query):
                if awaiting_confirmation:
                    subject = pending_topic or active_entity or current_topic
                    if subject:
                        rewritten_query = self._rewrite_about_subject(user_query, subject)
                        awaiting_confirmation = False
                        pending_topic = None
                        clarification_required = False
                    else:
                        clarification_required = True
                else:
                    # "ok"/"yes"/etc. with no pending question from the bot is
                    # just a plain acknowledgment, not a real confirmation —
                    # leave the query as-is instead of rewriting it into an
                    # unrelated full question (which would trigger a spurious
                    # cache hit / navigation for a topic the user never asked
                    # about in this turn).
                    follow_up_detected = False
            elif self._is_negative(normalized_query):
                awaiting_confirmation = False
                pending_topic = None
                clarification_required = True
            # No third branch needed here: _is_confirmation(text) being True
            # guarantees text is in AFFIRMATIVE_RESPONSES or
            # NEGATIVE_RESPONSES, so one of the two branches above always
            # applies.
        else:
            subject = active_entity or current_topic or pending_topic
            if subject and self._needs_context(normalized_query):
                follow_up_detected = True
                rewritten_query = self._rewrite_with_subject(user_query, subject)
            elif subject and self._contains_pronoun(normalized_query):
                follow_up_detected = True
                rewritten_query = self._rewrite_with_subject(user_query, subject)
            elif matched_topic is not None and self._looks_like_topic_only_query(normalized_query, matched_topic.topic):
                rewritten_query = self._rewrite_about_subject(user_query, active_entity or current_topic or matched_topic.active_entity)
                follow_up_detected = True
            elif matched_topic is not None and self._needs_canonicalization(normalized_query, matched_topic):
                subject = active_entity or current_topic or matched_topic.active_entity
                rewritten_query = self._rewrite_about_subject(user_query, subject)
                follow_up_detected = True
            elif subject is None and self._is_short_vague_query(normalized_query):
                clarification_required = True

        if current_topic and navigation_hint is None:
            navigation_hint = self._navigation_hint_for_topic(current_topic)

        if active_entity is None and current_topic is not None:
            active_entity = self._default_entity_for_topic(current_topic)

        session_state = ConversationSessionState(
            current_topic=current_topic,
            active_entity=active_entity,
            last_user_query=user_query,
            last_assistant_message=history_state.last_assistant_message,
            awaiting_confirmation=awaiting_confirmation,
            pending_topic=pending_topic,
            recent_entities=self._merge_recent_entities(memory_state.recent_entities, active_entity),
            last_navigation=navigation_hint or last_navigation,
            metadata={
                "matched_topic_source": matched_topic_source,
                "clarification_required": clarification_required,
            },
        )
        self.memory_store.set(session_id, session_state)

        metadata = {
            "session_id": session_id,
            "matched_topic": matched_topic.topic if matched_topic else None,
            "matched_entity": matched_topic.active_entity if matched_topic else None,
            "rewrite_reason": self._rewrite_reason(
                user_query=user_query,
                clarification_required=clarification_required,
                follow_up_detected=follow_up_detected,
                awaiting_confirmation=awaiting_confirmation,
                matched_topic=matched_topic,
            ),
            "state": {
                "current_topic": current_topic,
                "active_entity": active_entity,
                "awaiting_confirmation": awaiting_confirmation,
                "pending_topic": pending_topic,
                "last_navigation": navigation_hint or last_navigation,
            },
        }

        logger.debug(
            "Conversation context for %s => original=%r rewritten=%r topic=%r entity=%r follow_up=%s nav=%r clarification=%s",
            session_id,
            user_query,
            rewritten_query,
            current_topic,
            active_entity,
            follow_up_detected,
            navigation_hint,
            clarification_required,
        )

        return ConversationContext(
            original_query=user_query,
            rewritten_query=rewritten_query,
            current_topic=current_topic,
            active_entity=active_entity,
            follow_up_detected=follow_up_detected,
            awaiting_confirmation=awaiting_confirmation,
            navigation_hint=navigation_hint,
            clarification_required=clarification_required,
            metadata=metadata,
        )

    def _seed_state_from_history(self, chat_history: list[dict[str, Any]]) -> ConversationSessionState:
        state = ConversationSessionState()
        for message in reversed(chat_history or []):
            text = self._normalize(message.get("text") or "")
            if not text:
                continue

            if state.last_assistant_message == "" and message.get("sender") == "bot":
                state.last_assistant_message = message.get("text") or ""

            confirmation_topic = self._extract_confirmation_topic(text)
            if confirmation_topic is not None:
                state.awaiting_confirmation = True
                state.pending_topic = confirmation_topic.active_entity
                state.current_topic = confirmation_topic.topic
                state.active_entity = confirmation_topic.active_entity
                break

            topic = self._detect_topic(text)
            if topic is not None:
                state.current_topic = topic.topic
                state.active_entity = topic.active_entity
                state.recent_entities = self._merge_recent_entities(state.recent_entities, topic.active_entity)
                break

        return state

    def _normalize(self, text: str) -> str:
        return " ".join(text.lower().strip().split())

    def _is_confirmation(self, text: str) -> bool:
        return text in AFFIRMATIVE_RESPONSES or text in NEGATIVE_RESPONSES

    def _is_affirmative(self, text: str) -> bool:
        return text in AFFIRMATIVE_RESPONSES

    def _is_negative(self, text: str) -> bool:
        return text in NEGATIVE_RESPONSES

    def _is_short_vague_query(self, text: str) -> bool:
        return len(text.split()) <= 4 and (self._contains_pronoun(text) or text in AFFIRMATIVE_RESPONSES or text in NEGATIVE_RESPONSES)

    def _needs_context(self, text: str) -> bool:
        for phrase in SHORT_FOLLOW_UP_PHRASES:
            if text == phrase or text.startswith(f"{phrase} "):
                return True
        return False

    def _contains_pronoun(self, text: str) -> bool:
        return PRONOUN_PATTERN.search(text) is not None

    def _detect_topic(self, text: str) -> TopicDefinition | None:
        # Evaluate every definition and keep the one whose matched alias is
        # the LONGEST (most specific) actual match in the text — not simply
        # the first definition that happens to have any match. This matters
        # because some short, generic aliases (e.g. "deod") are technically
        # valid for one topic (DEOD Token) but also appear inside queries
        # that are really about a different, more specific topic (e.g.
        # "DEOD staking" should resolve to Staking, not DEOD Token, even
        # though "deod" alone is a DEOD Token alias).
        best_match: TopicDefinition | None = None
        best_match_length = -1
        for definition in TOPIC_DEFINITIONS:
            for alias in self._topic_aliases(definition):
                if alias and self._phrase_in_text(alias, text) and len(alias) > best_match_length:
                    best_match = definition
                    best_match_length = len(alias)
        if best_match is not None:
            return best_match

        tokens = text.split()
        if tokens:
            for token in tokens:
                close_matches = get_close_matches(token, self._all_topic_aliases(), n=1, cutoff=0.82)
                if close_matches:
                    matched_alias = close_matches[0]
                    topic = self._topic_for_alias(matched_alias)
                    if topic is not None:
                        return topic
        return None

    def _extract_confirmation_topic(self, text: str) -> TopicDefinition | None:
        patterns = (
            r"would you like to know more about (?P<topic>.+)",
            r"do you want to know more about (?P<topic>.+)",
            r"want to know more about (?P<topic>.+)",
            r"would you like to hear more about (?P<topic>.+)",
            r"do you want to continue with (?P<topic>.+)",
        )
        for pattern in patterns:
            match = re.search(pattern, text)
            if not match:
                continue
            topic_text = match.group("topic").strip(" .?!")
            detected = self._detect_topic(topic_text)
            if detected is not None:
                return detected
        return None

    def _topic_aliases(self, definition: TopicDefinition) -> Iterable[str]:
        yield definition.topic
        yield definition.active_entity
        yield definition.navigation_hint
        yield definition.active_entity.replace("Decentrawood ", "")
        for alias in sorted(definition.aliases, key=len, reverse=True):
            yield alias

    def _all_topic_aliases(self) -> list[str]:
        aliases: list[str] = []
        for definition in TOPIC_DEFINITIONS:
            aliases.extend(self._topic_aliases(definition))
        return [alias for alias in aliases if alias]

    def _topic_for_alias(self, alias: str) -> TopicDefinition | None:
        normalized_alias = self._normalize(alias)
        for definition in TOPIC_DEFINITIONS:
            for candidate in self._topic_aliases(definition):
                if self._normalize(candidate) == normalized_alias:
                    return definition
        return None

    def _phrase_in_text(self, phrase: str, text: str) -> bool:
        escaped = re.escape(phrase.lower())
        pattern = rf"\b{escaped}\b" if " " not in phrase else escaped
        return re.search(pattern, text) is not None

    def _navigation_hint_for_topic(self, topic: str) -> str | None:
        definition = next((item for item in TOPIC_DEFINITIONS if item.topic == topic), None)
        return definition.navigation_hint if definition else None

    def _default_entity_for_topic(self, topic: str) -> str | None:
        definition = next((item for item in TOPIC_DEFINITIONS if item.topic == topic), None)
        return definition.active_entity if definition else None

    def _merge_recent_entities(self, recent_entities: list[str], active_entity: str | None) -> list[str]:
        merged = [entity for entity in recent_entities if entity]
        if active_entity and active_entity not in merged:
            merged.append(active_entity)
        return merged[-5:]

    def _looks_like_topic_only_query(self, text: str, topic: str) -> bool:
        cleaned = text.strip(" .?!")
        if cleaned == topic.lower():
            return True
        return len(cleaned.split()) <= 3 and self._detect_topic(cleaned) is not None

    def _needs_canonicalization(self, text: str, topic: TopicDefinition) -> bool:
        canonical_entity = self._normalize(topic.active_entity.replace("Decentrawood ", ""))
        canonical_topic = self._normalize(topic.topic)
        return canonical_entity not in text and canonical_topic not in text and len(text.split()) <= 6

    def _rewrite_about_subject(self, original_query: str, subject: str) -> str:
        stripped = original_query.strip().rstrip(".?!")
        if self._starts_with_confirmation(stripped):
            return f"Tell me about {subject}."
        if stripped.lower().startswith("open") or stripped.lower().startswith("show"):
            return f"Open {subject} page."
        if stripped.lower().startswith("how does"):
            return f"How does {subject} work?"
        if stripped.lower().startswith("what about"):
            return f"What about {subject}?"
        if stripped.lower().startswith("tell me more"):
            return f"Tell me more about {subject}."
        if stripped.lower().startswith("explain"):
            return f"Explain {subject}."
        return self._rewrite_with_subject(original_query, subject)

    def _rewrite_with_subject(self, original_query: str, subject: str) -> str:
        stripped = original_query.strip()
        lowered = stripped.lower()

        if lowered in {"how", "why"}:
            return f"How does {subject} work?" if lowered == "how" else f"Why {subject}?"
        if lowered in {"more", "continue", "next"}:
            return f"Tell me more about {subject}."
        if lowered in {"open it", "show it"}:
            return f"Open {subject} page."

        rewritten = PRONOUN_PATTERN.sub(subject, stripped)
        if rewritten != stripped:
            return self._capitalize_sentence(self._ensure_sentence_terminal(rewritten, original_query))

        if lowered.startswith("tell me more"):
            return f"Tell me more about {subject}."
        if lowered.startswith("open") or lowered.startswith("show"):
            return f"Open {subject} page."
        if lowered.startswith("how does"):
            return f"How does {subject} work?"
        if lowered.startswith("what about"):
            return f"What about {subject}?"
        if lowered.startswith("why"):
            return f"Why {subject}?"
        if lowered.startswith("explain"):
            return f"Explain {subject}."
        return f"{stripped} about {subject}."

    def _ensure_sentence_terminal(self, text: str, original_query: str) -> str:
        if text.endswith((".", "?", "!")):
            return text
        if original_query.strip().endswith("?"):
            return f"{text}?"
        return f"{text}."

    def _capitalize_sentence(self, text: str) -> str:
        if not text:
            return text
        return text[0].upper() + text[1:]

    def _starts_with_confirmation(self, text: str) -> bool:
        lowered = text.lower().strip()
        return lowered in AFFIRMATIVE_RESPONSES or lowered in NEGATIVE_RESPONSES

    def _rewrite_reason(
        self,
        user_query: str,
        clarification_required: bool,
        follow_up_detected: bool,
        awaiting_confirmation: bool,
        matched_topic: TopicDefinition | None,
    ) -> str:
        if clarification_required:
            return "clarification_required"
        if awaiting_confirmation:
            return "awaiting_confirmation"
        if follow_up_detected:
            return "follow_up"
        if matched_topic is not None:
            return "topic_shift"
        return "direct_query"