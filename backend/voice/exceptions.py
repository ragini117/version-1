class VoiceError(Exception):
    """Base exception for voice module errors."""


class EmptyTranscriptError(VoiceError):
    """Raised when a voice request contains no usable transcript text."""
