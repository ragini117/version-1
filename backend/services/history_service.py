from database.mongo_db import (
    get_chat_history,
    get_paginated_chat_history,
    get_recent_turns,
    save_chat_message,
    save_token,
    verify_token_in_db,
)


class HistoryService:
    def save_chat(self, session_id, user_message, assistant_response, intent=None, navigation_route=None, decision=None, navigation=None, confidence=1.0):
        return save_chat_message(session_id, user_message, assistant_response, intent=intent, navigation_route=navigation_route, decision=decision, navigation=navigation, confidence=confidence)


    def get_chat_history(self, session_id):
        return get_chat_history(session_id)

    def get_recent_turns(self, session_id, max_turns=10):
        return get_recent_turns(session_id, max_turns=max_turns)

    def save_token(self, token, session_id):
        return save_token(token, session_id)

    def verify_token(self, token):
        return verify_token_in_db(token)

    def get_paginated_chat_history(self, session_id, page=1, limit=10, time_limit_hours=1):
        return get_paginated_chat_history(session_id, page=page, limit=limit, time_limit_hours=time_limit_hours)
