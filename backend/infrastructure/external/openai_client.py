from functools import lru_cache
import openai
from config import OPENAI_API_KEY

class OpenAIClientAdapter:
    def __init__(self):
        if hasattr(openai, "OpenAI"):
            self._client = openai.OpenAI(api_key=OPENAI_API_KEY)
            self.chat = self._client.chat
        else:
            openai.api_key = OPENAI_API_KEY
            self._client = openai
            self.chat = self._create_legacy_chat()

    def _create_legacy_chat(self):
        class LegacyCompletions:
            @staticmethod
            def create(**kwargs):
                return openai.ChatCompletion.create(**kwargs)
        class LegacyChat:
            completions = LegacyCompletions()
        return LegacyChat()

@lru_cache(maxsize=1)
def get_openai_client() -> OpenAIClientAdapter:
    return OpenAIClientAdapter()

def extract_message_content(response) -> str:
    choice = response.choices[0]
    message = getattr(choice, "message", None)
    if message is not None:
        return (getattr(message, "content", "") or "").strip()
    return (choice["message"]["content"] or "").strip()

def extract_delta_content(chunk) -> str:
    choice = chunk.choices[0]
    delta = getattr(choice, "delta", None)
    if delta is not None:
        return getattr(delta, "content", None) or ""
    return choice.get("delta", {}).get("content", "")
