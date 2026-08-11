from infrastructure.database.redis_client import get_redis_client as infra_get_redis_client

def get_redis_client():
    client = infra_get_redis_client()
    client.ping()
    return client
