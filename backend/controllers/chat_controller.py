import asyncio
import datetime
import uuid
import json
import jwt
from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from config import JWT_SECRET, ROUTES_ENRICHED_PATH
from orchestrator.chat_orchestrator import ChatOrchestrator
from services.stream_service import StreamService

router = APIRouter()
stream_service = StreamService()

class ChatRequest(BaseModel):
    text: str
    stream: bool = False

def _get_orchestrator(request: Request) -> ChatOrchestrator:
    return request.app.state.chat_orchestrator

def _bearer_token(request: Request) -> str | None:
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ", 1)[1]
    return None

@router.get("/chat/init")
async def chat_init(request: Request):
    orchestrator = _get_orchestrator(request)
    session_id = str(uuid.uuid4())
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({"session_id": session_id, "exp": expiration}, JWT_SECRET, algorithm="HS256")
    
    # save_token hits MongoDB — offloaded to a worker thread
    await asyncio.to_thread(orchestrator.history_service.save_token, token, session_id)
    return JSONResponse({"token": token}, status_code=200)

async def _handle_chat(request: Request, body: ChatRequest, force_stream: bool = False):
    orchestrator = _get_orchestrator(request)

    user_message = body.text.strip()
    if not user_message:
        return JSONResponse({"error": "Empty message"}, status_code=400)

    token = _bearer_token(request)
    result = await orchestrator.handle_message(user_message, token=token)

    wants_stream = force_stream or request.headers.get("Accept") == "text/event-stream" or body.stream
    if wants_stream:
        metadata = {
            "type": "metadata",
            "intent": result["intent"],
            "token": result["token"],
            "sources": result["sources"],
            "decision": result.get("decision"),
            "navigation": result.get("navigation"),
        }
        if result.get("navigate_to"):
            metadata["navigate_to"] = result["navigate_to"]
        return StreamingResponse(
            stream_service.stream_result(metadata, result["response_text"]),
            media_type="text/event-stream",
        )

    response_data = {
        "response": result["response_text"],
        "intent": result["intent"],
        "session_id": result["session_id"],
        "token": result["token"],
        "sources": result["sources"],
        "decision": result.get("decision"),
        "navigation": result.get("navigation"),
        "timings": result.get("timings", {}),
    }
    if result.get("navigate_to"):
        response_data["navigate_to"] = result["navigate_to"]
    return JSONResponse(response_data, status_code=200)

@router.post("/chat")
@router.post("/")
async def chat(request: Request, body: ChatRequest):
    return await _handle_chat(request, body)

@router.post("/stream")
async def stream_chat(request: Request, body: ChatRequest):
    return await _handle_chat(request, body, force_stream=True)

@router.get("/chat/history")
async def chat_history(request: Request):
    orchestrator = _get_orchestrator(request)
    token = _bearer_token(request)
    if not token:
        return JSONResponse({"error": "Missing or invalid token"}, status_code=401)

    token_doc = await asyncio.to_thread(orchestrator.history_service.verify_token, token)
    if not token_doc:
        return JSONResponse({"error": "Session expired or invalid token"}, status_code=401)

    session_id = token_doc.get("session_id")
    history = await asyncio.to_thread(orchestrator.history_service.get_chat_history, session_id)
    return JSONResponse({"session_id": session_id, "history": history}, status_code=200)

@router.get("/chat/history/paginated")
async def chat_history_paginated(request: Request, page: int = Query(1), limit: int = Query(10)):
    orchestrator = _get_orchestrator(request)
    token = _bearer_token(request)
    if not token:
        return JSONResponse({"error": "Missing or invalid token"}, status_code=401)

    token_doc = await asyncio.to_thread(orchestrator.history_service.verify_token, token)
    if not token_doc:
        return JSONResponse({"error": "Session expired or invalid token"}, status_code=401)

    session_id = token_doc.get("session_id")
    if page < 1:
        page = 1
    if limit < 1:
        limit = 10

    result = await asyncio.to_thread(
        orchestrator.history_service.get_paginated_chat_history,
        session_id,
        page=page,
        limit=limit,
        time_limit_hours=1,
    )
    return JSONResponse(result, status_code=200)

@router.get("/intents")
async def get_intents():
    try:
        with open(ROUTES_ENRICHED_PATH, "r", encoding="utf-8") as f:
            routes = json.load(f)

        return JSONResponse(
            {
                "pages": routes
            },
            status_code=200,
        )

    except FileNotFoundError:
        return JSONResponse(
            {
                "error": "routes_enriched.json not found",
                "path": ROUTES_ENRICHED_PATH,
            },
            status_code=500,
        )

    except Exception as exc:
        return JSONResponse(
            {
                "error": str(exc),
            },
            status_code=500,
        )
