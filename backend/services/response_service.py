from conversation_utils import build_conversation_messages as build_prompt_messages
from Rag.system_prompt import SYSTEM_PROMPT
from utils.openai_client import extract_delta_content, extract_message_content, get_openai_client


class ResponseService:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = get_openai_client()

    def generate_response(self, context: str, history_turns, user_message: str):
        sys_prompt = SYSTEM_PROMPT.replace("{context}", context)
        messages = build_prompt_messages(sys_prompt, user_message, history_turns)
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.7,
        )
        return extract_message_content(response)

    def reformat_live_response(self, query: str, raw_response: str, history_list):
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
        except Exception:
            return raw_response
