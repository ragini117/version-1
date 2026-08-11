from conversation_utils import build_conversation_messages as build_prompt_messages
from Rag.system_prompt import SYSTEM_PROMPT
from infrastructure.external.openai_client import extract_message_content, get_openai_client
from utils.logger import get_logger

logger = get_logger("response_generator")

class ResponseGenerator:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = get_openai_client()

    def generate_response(self, context: str, history_turns: list, user_message: str) -> str:
        """
        Queries the LLM with the provided context and history to generate a conversational response.
        """
        sys_prompt = SYSTEM_PROMPT.replace("{context}", context)
        messages = build_prompt_messages(sys_prompt, user_message, history_turns)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=0.7,
            )
            return extract_message_content(response)
        except Exception as e:
            logger.error(f"Error generating LLM response: {e}")
            # Graceful degradation fallback message
            return (
                "I'm sorry, I'm having trouble connecting to my brain right now. "
                "For assistance, feel free to contact info@decentrawood.com."
            )

    def reformat_live_response(self, query: str, raw_response: str, history_list: list) -> str:
        """
        Formats search results into a shorter conversational response for price or news queries.
        """
        system_instruction = (
            "You are the Decentrawood AI Voice Assistant.\n"
            "Your task is to reformat the provided search result answer to the user's query into a conversational voice-assistant tone.\n"
            "Guidelines:\n"
            "- Cap responses to 1-2 sentences for simple factual lookups (such as price, yes/no questions, or single facts).\n"
            "- Reserve 3-4 sentences ONLY for complex explanatory questions (such as how a system or feature works).\n"
            "- Default to the shortest complete answer. Do not add extra context, disclaimers, or suggestions unless explicitly asked.\n"
            "- Do not repeat info already given in the conversation history.\n"
            "- Resolve references like 'it', 'that', etc. naturally."
        )
        messages = [{"role": "system", "content": system_instruction}]
        for msg in (history_list or [])[-20:]:
            role = "user" if msg["sender"] == "user" else "assistant"
            messages.append({"role": role, "content": msg["text"]})
        messages.append({"role": "user", "content": f"User Query: {query}\nRaw Search Result: {raw_response}"})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=0.7,
            )
            return extract_message_content(response)
        except Exception as e:
            logger.warning(f"Error reformating live response: {e}. Returning raw response.")
            return raw_response
