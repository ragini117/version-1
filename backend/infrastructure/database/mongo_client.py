import os
from functools import lru_cache
from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME

@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
    """
    Initializes and returns a connection-pooled MongoClient instance.
    Includes custom timeouts to fail fast during network splits/outages.
    """
    return MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=2000,
        connectTimeoutMS=2000,
        socketTimeoutMS=5000,
        maxPoolSize=50,
        minPoolSize=5
    )

def get_mongo_db():
    """
    Returns the configured database instance.
    """
    client = get_mongo_client()
    return client[MONGO_DB_NAME]
