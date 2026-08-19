import datetime
from functools import lru_cache

from pymongo import ASCENDING, MongoClient

from config import MONGO_DB_NAME, MONGO_URI


from infrastructure.database.mongo_client import get_mongo_client, get_mongo_db

def get_client():
    return get_mongo_client()

def get_db():
    db = get_mongo_db()
    # Try creating indexes but ignore failures if DB is offline/readonly
    try:
        db["chat_history"].create_index([("session_id", ASCENDING), ("timestamp", ASCENDING)])
        db["chat_history"].create_index([("expires_at", ASCENDING)], expireAfterSeconds=0)
        db["session_tokens"].create_index([("token", ASCENDING)], unique=True)
        db["session_tokens"].create_index([("expires_at", ASCENDING)])
    except Exception:
        pass
    return db


def get_chat_collection():
    return get_db()["chat_history"]


def get_tokens_collection():
    return get_db()["session_tokens"]


def save_chat_message(session_id, user_message, assistant_response, intent=None, navigation_route=None, decision=None, navigation=None, confidence=1.0):
    try:
        collection = get_chat_collection()
        now = datetime.datetime.utcnow()
        expires_at = now + datetime.timedelta(hours=1)
        
        result = collection.insert_one(
            {
                "session_id": session_id,
                "user_query": user_message,
                "bot_response": assistant_response,
                "intent": intent,
                "navigation_route": navigation_route,
                "decision": decision,
                "navigation": navigation,
                "confidence": confidence,
                "timestamp": now,
                "expires_at": expires_at,
            }
        )
        
        # Update expires_at for all previous messages in this session
        collection.update_many(
            {"session_id": session_id},
            {"$set": {"expires_at": expires_at}}
        )
        
        return str(result.inserted_id)
    except Exception:
        return None



def get_chat_history(session_id):
    try:
        collection = get_chat_collection()
        cursor = collection.find({"session_id": session_id}).sort("timestamp", 1)
        history = []
        idx = 1
        for doc in cursor:
            timestamp_val = doc.get("timestamp")
            if isinstance(timestamp_val, datetime.datetime):
                timestamp_str = timestamp_val.isoformat() + "Z"
            else:
                timestamp_str = str(timestamp_val) if timestamp_val else datetime.datetime.utcnow().isoformat() + "Z"

            user_text = doc.get("user_query")
            bot_text = doc.get("bot_response")
            if not user_text or not bot_text:
                continue

            history.append({"id": f"h-{idx}", "text": user_text, "sender": "user", "timestamp": timestamp_str})
            idx += 1
            history.append({"id": f"h-{idx}", "text": bot_text, "sender": "bot", "timestamp": timestamp_str})
            idx += 1

        return history
    except Exception:
        return []


def get_recent_turns(session_id, max_turns=10):
    try:
        collection = get_chat_collection()
        docs = list(collection.find({"session_id": session_id}).sort("timestamp", -1).limit(max_turns))
        docs.reverse()
        messages = []
        for doc in docs:
            user_text = (doc.get("user_query") or "").strip()
            bot_text = (doc.get("bot_response") or "").strip()
            if not user_text or not bot_text:
                continue
            messages.append({"role": "user", "content": user_text})
            messages.append({"role": "assistant", "content": bot_text})
        return messages
    except Exception:
        return []


def save_token(token, session_id):
    try:
        collection = get_tokens_collection()
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        collection.insert_one(
            {
                "token": token,
                "session_id": session_id,
                "created_at": datetime.datetime.utcnow(),
                "expires_at": expires_at,
            }
        )
        return True
    except Exception:
        return False


def verify_token_in_db(token):
    try:
        collection = get_tokens_collection()
        doc = collection.find_one({"token": token})
        if doc:
            expires_at = doc.get("expires_at")
            if expires_at and expires_at > datetime.datetime.utcnow():
                return doc
        return None
    except Exception:
        return None


def get_paginated_chat_history(session_id, page=1, limit=10, time_limit_hours=1):
    try:
        collection = get_chat_collection()
        cutoff_time = datetime.datetime.utcnow() - datetime.timedelta(hours=time_limit_hours)
        query = {"session_id": session_id, "timestamp": {"$gte": cutoff_time}}
        total_turns = collection.count_documents(query)
        cursor = collection.find(query).sort("timestamp", -1).skip((page - 1) * limit).limit(limit)

        history = []
        for doc in cursor:
            timestamp_val = doc.get("timestamp")
            if isinstance(timestamp_val, datetime.datetime):
                timestamp_str = timestamp_val.isoformat() + "Z"
            else:
                timestamp_str = str(timestamp_val) if timestamp_val else datetime.datetime.utcnow().isoformat() + "Z"

            user_text = doc.get("user_query")
            bot_text = doc.get("bot_response")
            if not user_text or not bot_text:
                continue

            history.append(
                {
                    "id": str(doc.get("_id")),
                    "session_id": doc.get("session_id"),
                    "user_query": user_text,
                    "bot_response": bot_text,
                    "timestamp": timestamp_str,
                }
            )

        return {
            "history": history,
            "pagination": {
                "total_turns": total_turns,
                "page": page,
                "limit": limit,
                "total_pages": (total_turns + limit - 1) // limit if total_turns > 0 else 0,
            },
        }
    except Exception:
        return {
            "history": [],
            "pagination": {"total_turns": 0, "page": page, "limit": limit, "total_pages": 0},
        }
