from services.stream_service import StreamService
from voice.navigation import strip_navigation_from_stream_metadata


class VoiceStreamService:
    """Voice-specific SSE wrapper — strips navigation from streamed metadata."""

    def __init__(self, stream_service: StreamService | None = None):
        self._stream = stream_service or StreamService()

    async def stream_voice_result(self, metadata: dict, response_text: str):
        voice_metadata = strip_navigation_from_stream_metadata(metadata)
        voice_metadata["voice_mode"] = True
        async for chunk in self._stream.stream_result(voice_metadata, response_text):
            yield chunk
