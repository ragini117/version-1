from voice.state import VoiceState


class VoiceSessionTracker:
    """
    Lightweight server-side voice session lifecycle tracker.

    STT/TTS run in the browser; this tracks processing phases for logging
    and coordinates the transcript → chatbot → answer flow.
    """

    def __init__(self, session_id: str | None = None):
        self.session_id = session_id
        self.state = VoiceState.IDLE

    def on_final_transcript(self) -> None:
        self.state = VoiceState.PROCESSING

    def on_response_ready(self) -> None:
        self.state = VoiceState.SPEAKING

    def on_complete(self) -> None:
        self.state = VoiceState.IDLE

    def on_error(self) -> None:
        self.state = VoiceState.ERROR
