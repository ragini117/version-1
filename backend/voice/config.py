import os

# Recommended client-side silence timeout before submitting a final transcript (ms).
# The browser STT hook should use this value; backend does not enforce it.
VOICE_SILENCE_TIMEOUT_MS = int(os.getenv("VOICE_SILENCE_TIMEOUT_MS", "2000"))

# When true, skip Qdrant route retrieval entirely for voice requests (answer-only mode).
VOICE_SKIP_ROUTE_RETRIEVAL = os.getenv("VOICE_SKIP_ROUTE_RETRIEVAL", "true").lower() in {
    "1",
    "true",
    "yes",
}
