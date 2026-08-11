import time
from typing import Dict, Any
from infrastructure.database.mongo_client import get_mongo_client
from infrastructure.database.redis_client import get_redis_client
from infrastructure.database.qdrant_client import get_qdrant_client
from infrastructure.external.openai_client import get_openai_client
from utils.logger import get_logger

logger = get_logger("health_monitor")

class HealthMonitor:
    def check_mongo(self) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            client = get_mongo_client()
            # The ping command is cheap and checks network connectivity
            client.admin.command('ping')
            elapsed = time.perf_counter() - start
            return {"status": "healthy", "latency_sec": round(elapsed, 4)}
        except Exception as e:
            logger.error(f"Health check failed for MongoDB: {e}")
            return {"status": "unhealthy", "error": str(e)}

    def check_redis(self) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            client = get_redis_client()
            client.ping()
            elapsed = time.perf_counter() - start
            return {"status": "healthy", "latency_sec": round(elapsed, 4)}
        except Exception as e:
            logger.error(f"Health check failed for Redis: {e}")
            return {"status": "unhealthy", "error": str(e)}

    def check_qdrant(self) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            client = get_qdrant_client()
            # Fast ping or fetch collections list
            client.get_collections()
            elapsed = time.perf_counter() - start
            return {"status": "healthy", "latency_sec": round(elapsed, 4)}
        except Exception as e:
            logger.error(f"Health check failed for Qdrant: {e}")
            return {"status": "unhealthy", "error": str(e)}

    def check_llm(self) -> Dict[str, Any]:
        start = time.perf_counter()
        try:
            client_adapter = get_openai_client()
            # Check models list to verify API key and network connectivity
            if hasattr(client_adapter._client, "models"):
                # modern client
                client_adapter._client.models.list(timeout=2.0)
            else:
                # legacy fallback
                import openai
                openai.Model.list(timeout=2.0)
            elapsed = time.perf_counter() - start
            return {"status": "healthy", "latency_sec": round(elapsed, 4)}
        except Exception as e:
            logger.error(f"Health check failed for LLM Provider: {e}")
            return {"status": "unhealthy", "error": str(e)}

    def run_all_checks(self) -> Dict[str, Any]:
        mongo_status = self.check_mongo()
        redis_status = self.check_redis()
        qdrant_status = self.check_qdrant()
        llm_status = self.check_llm()

        overall_healthy = (
            mongo_status["status"] == "healthy" and
            redis_status["status"] == "healthy" and
            qdrant_status["status"] == "healthy" and
            llm_status["status"] == "healthy"
        )

        return {
            "status": "healthy" if overall_healthy else "degraded",
            "dependencies": {
                "mongodb": mongo_status,
                "redis": redis_status,
                "qdrant": qdrant_status,
                "llm_provider": llm_status
            }
        }
