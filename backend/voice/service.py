from typing import TYPE_CHECKING

from voice.exceptions import EmptyTranscriptError
from voice.session import VoiceSessionTracker
from utils.logger import get_logger

if TYPE_CHECKING:
    from orchestrator.chat_orchestrator import ChatOrchestrator

logger = get_logger("voice_service")


class VoiceService:
    """
    Voice coordinator: finalized transcript → shared chatbot core → voice-safe answer.

    Does NOT implement a separate RAG pipeline.
    """

    def __init__(self, orchestrator: "ChatOrchestrator"):
        self.orchestrator = orchestrator

    async def handle_transcript(
        self,
        transcript: str,
        token: str | None = None,
    ) -> dict:
        cleaned = (transcript or "").strip()
        if not cleaned:
            raise EmptyTranscriptError("Voice request requires a non-empty transcript")

        session_tracker = VoiceSessionTracker()
        session_tracker.on_final_transcript()

        logger.info("[VOICE] Processing final transcript: %r", cleaned)

        result = await self.orchestrator.handle_message(
            cleaned,
            token=token,
            voice_mode=True,
        )

        session_tracker.on_response_ready()
        session_tracker.on_complete()

        return result
