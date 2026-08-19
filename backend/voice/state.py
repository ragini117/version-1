from enum import Enum


class VoiceState(str, Enum):
    """Client-side voice session phases mirrored for backend logging."""

    IDLE = "idle"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"
    INTERRUPTED = "interrupted"
    ERROR = "error"
