from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.health_monitor import HealthMonitor

router = APIRouter()
health_monitor = HealthMonitor()

@router.get("/health")
async def health():
    """
    Detailed dependency check for MongoDB, Redis, Qdrant, and OpenAI.
    """
    res = health_monitor.run_all_checks()
    status_code = 200 if res["status"] == "healthy" else 503
    return JSONResponse(res, status_code=status_code)
