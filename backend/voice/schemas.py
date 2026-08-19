from pydantic import BaseModel, Field


class VoiceRequest(BaseModel):
    """Voice-mode chat request — transcript is finalized client-side via STT."""

    text: str = Field(..., description="Final transcript from client STT")
    stream: bool = False
    voice_mode: bool = True


class VoiceTranscript(BaseModel):
    partial: str = ""
    final: str = ""
    is_final: bool = False


class VoiceSession(BaseModel):
    session_id: str | None = None
    state: str = "idle"
