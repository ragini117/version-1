import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.chat_controller import router as chat_router
from controllers.health_controller import router as health_router
from orchestrator.chat_orchestrator import ChatOrchestrator
from Rag.helper import download_embeddings

# Only allow localhost during development.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: build the orchestrator once so every downstream client
    # (Qdrant, Redis, Mongo, OpenAI) is instantiated a single time and
    # pooled/reused across requests instead of being re-created per call.
    orchestrator = ChatOrchestrator(download_embeddings())
    app.state.chat_orchestrator = orchestrator
    yield
    # Shutdown: nothing to close explicitly yet — the underlying clients
    # (pymongo, redis-py, qdrant-client) manage their own connection pools.
    # If/when those are swapped for native async clients (motor,
    # redis.asyncio, AsyncQdrantClient), close them here.


def create_app() -> FastAPI:
    app = FastAPI(title="Decentrawood Chatbot API", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Accept", "Authorization"],
    )

    app.include_router(chat_router)
    app.include_router(health_router)
    return app


app = create_app()

# Run with: uvicorn app:app --host 0.0.0.0 --port $PORT --workers 4
