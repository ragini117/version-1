import asyncio
import json


class StreamService:
    def chunk_text(self, text: str, chunk_size: int = 50):
        for index in range(0, len(text), chunk_size):
            yield text[index:index + chunk_size]

    async def stream_result(self, metadata: dict, response_text: str):
        """Async generator for FastAPI's StreamingResponse. Chunks are
        already in memory (no I/O per chunk), so this just yields control
        back to the event loop between chunks rather than doing real
        async work — kept async so it plugs directly into StreamingResponse
        without Starlette needing to wrap a sync generator in a thread."""
        yield f"data: {json.dumps(metadata)}\n\n"
        for chunk in self.chunk_text(response_text):
            yield f"data: {json.dumps({'type': 'content', 'delta': chunk})}\n\n"
            await asyncio.sleep(0)
        yield "data: [DONE]\n\n"
