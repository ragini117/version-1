import json
from typing import Any
from conversation_dataclasses.models import ConversationContext
from session_memory import ConversationSessionState, SessionMemoryStore
from utils.logger import get_logger
from infrastructure.external.openai_client import get_openai_client, extract_message_content
from config import MODEL_NAME

logger = get_logger("conversation_manager")

class ConversationManager:
    """Generic conversational context resolution using structured LLM output."""

    def __init__(self, memory_store: SessionMemoryStore | None = None, session_ttl_seconds: int = 3600):
        self.memory_store = memory_store or SessionMemoryStore(ttl_seconds=session_ttl_seconds)
        self.client = get_openai_client()
        self.model_name = MODEL_NAME

    def process_query(self, session_id: str, user_query: str, chat_history: list[dict[str, Any]]) -> ConversationContext:
        normalized_query = " ".join(user_query.lower().strip().split())

        # Retrieve current session state
        state = self.memory_store.get(session_id) or ConversationSessionState()
        
        rewritten_query = user_query.strip()
        follow_up_detected = False
        clarification_required = False
        active_topic = state.current_topic
        referenced_entities = state.recent_entities
        intent = state.previous_intent
        
        if chat_history:
            try:
                resolution_json = self._resolve_context_with_llm(user_query, chat_history, state)
                resolution = json.loads(resolution_json)
                
                rewritten_query = resolution.get("resolved_query", user_query).strip()
                follow_up_detected = resolution.get("is_follow_up", False)
                clarification_required = resolution.get("clarification_needed", False)
                
                # SAFETY NET: If the rewritten query is identical to the original
                # AND the original is a short generic confirmation (yes/ok/sure/tell me more etc.)
                # AND we have a known active topic — force a topic-anchored rewrite.
                SHORT_CONFIRMATIONS = {
                    "yes", "yeah", "yep", "sure", "ok", "okay", "alright",
                    "go on", "please", "tell me more", "yes please", "of course",
                    "i like to know", "i want to know", "show me", "list them",
                    "all of them", "give me all", "the names", "all names",
                }
                stripped_lower = user_query.lower().strip().rstrip(".!?")
                is_short_confirmation = (
                    len(user_query.split()) <= 10
                    and any(c in stripped_lower for c in SHORT_CONFIRMATIONS)
                )
                if (
                    is_short_confirmation
                    and rewritten_query.lower().strip() == user_query.lower().strip()
                    and state.current_topic
                    and state.recent_entities
                ):
                    entity_hint = ", ".join(state.recent_entities[:3])
                    rewritten_query = (
                        f"{user_query} — regarding {entity_hint} in the context of {state.current_topic}"
                    )
                    follow_up_detected = True
                
                # Update State with new findings
                new_topic = resolution.get("active_topic")
                if new_topic:
                    active_topic = new_topic
                    
                new_entities = resolution.get("referenced_entities", [])
                if new_entities:
                    referenced_entities = new_entities
                    
                new_intent = resolution.get("intent")
                if new_intent:
                    intent = new_intent
                    
            except Exception as e:
                logger.error(f"Error in LLM generic context resolution: {e}")
                # Fallback to original query on failure
                rewritten_query = user_query.strip()

        # Update Session Memory
        self.memory_store.update(
            session_id,
            current_topic=active_topic,
            recent_entities=referenced_entities,
            previous_intent=intent,
            last_user_query=user_query
        )

        logger.debug(
            "[ConvManager] session=%s original=%r resolved=%r follow_up=%s clarification=%s topic=%s entities=%s",
            session_id, user_query, rewritten_query, follow_up_detected, clarification_required, active_topic, referenced_entities
        )

        return ConversationContext(
            original_query=user_query,
            rewritten_query=rewritten_query,
            current_topic=active_topic,
            active_entity=referenced_entities[-1] if referenced_entities else None,
            referenced_entities=referenced_entities,
            intent=intent,
            follow_up_detected=follow_up_detected,
            awaiting_confirmation=False,
            navigation_hint=None,
            clarification_required=clarification_required,
            metadata={"rewrite_reason": "follow_up" if follow_up_detected else "direct_query"},
        )

    def _resolve_context_with_llm(self, user_query: str, chat_history: list[dict[str, Any]], state: ConversationSessionState) -> str:
        system_instruction = (
            "You are the Conversational Context Resolution layer for the Decentrawood AI assistant.\n"
            "Your task is to analyze the user's latest query, the conversation history, and the current state to produce a structured JSON object representing the user's true intent.\n\n"
            "GUIDELINES:\n"
            "1. **resolved_query**: If the query is a follow-up (uses pronouns like 'it', 'that', 'which one', implies a previous action, or continues a topic), rewrite it to be FULLY SELF-CONTAINED.\n"
            "   - E.g., 'Can I stake it?' -> 'Can DEOD be staked?'\n"
            "   - E.g., 'Which one is free?' -> 'Which Decentrawood game is free?'\n"
            "   - E.g., 'What about governance?' -> 'What is the governance of DEOD?'\n"
            "   - IMPORTANT: Short affirmations like 'Yes', 'Yes, I like to know all the names', 'Tell me more', 'Sure', 'Go on', 'List them' ARE follow-ups. Rewrite them using the previous topic.\n"
            "   - E.g., Previous: AI listed 22 culture zone landmarks. User: 'Yes, I like to know all the names.' -> 'What are the names of all temples and landmarks in the Decentrawood Culture Zone?'\n"
            "   - E.g., Previous: AI talked about games. User: 'Yes' -> 'Tell me more about Decentrawood games.'\n"
            "   - IF THE QUERY IS A BRAND NEW TOPIC or already self-contained (e.g., 'What games are available?', 'What is GTA 6?'), return it EXACTLY as is. Do NOT forcibly attach previous entities.\n"
            "2. **is_follow_up**: Boolean. True if the user's query relies on the previous context. Short affirmations are ALWAYS follow-ups when there is prior context.\n"
            "3. **clarification_needed**: Boolean. True ONLY if there are multiple possible ambiguous references and you cannot safely determine what the user means without hallucinating.\n"
            "4. **active_topic**: A short string describing the current high-level topic (e.g., 'gaming', 'governance', 'tokens', 'culture zone'). Update this if the user switches topics.\n"
            "5. **referenced_entities**: A list of string entity names being discussed (e.g., ['Culture Zone', 'temples']).\n"
            "6. **intent**: A short string describing the user's intent (e.g., 'information_query', 'list_request', 'comparison').\n\n"
            "You MUST output ONLY valid JSON matching this schema:\n"
            "{\n"
            "  \"is_follow_up\": boolean,\n"
            "  \"resolved_query\": \"string\",\n"
            "  \"active_topic\": \"string\",\n"
            "  \"referenced_entities\": [\"string\"],\n"
            "  \"intent\": \"string\",\n"
            "  \"clarification_needed\": boolean\n"
            "}\n"
        )
        
        state_context = f"CURRENT STATE:\nActive Topic: {state.current_topic}\nRecent Entities: {state.recent_entities}\nPrevious Intent: {state.previous_intent}"
        
        messages = [
            {"role": "system", "content": system_instruction},
            {"role": "system", "content": state_context}
        ]
        
        # Take up to last 6 messages for context (3 turns)
        for msg in chat_history[-6:]:
            role = "user" if msg.get("sender") == "user" else "assistant"
            text = msg.get("text") or ""
            messages.append({"role": role, "content": text})
            
        messages.append({"role": "user", "content": user_query})
        
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.0,
            response_format={ "type": "json_object" }
        )
        
        return extract_message_content(response).strip()