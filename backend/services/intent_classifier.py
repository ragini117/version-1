from utils.logger import get_logger

logger = get_logger("intent_classifier")

class IntentClassifier:
    """
    Lightweight intent classifier to determine if a query requires live data 
    (e.g., token prices, news) that must be fetched from an external source.
    """
    def __init__(self, model_name: str = ""):
        self.model_name = model_name

    def enhance_live_query(self, query: str) -> str:
        q = query.lower().strip()
        if "news" in q or "update" in q or "recent" in q or "latest" in q:
            if "decentrawood" not in q and "deod" not in q and "tunehub" not in q:
                return f"Decentrawood news: {query}"
        if "price" in q or "market cap" in q or "volume" in q or "value" in q or "worth" in q:
            if "decentrawood" not in q and "deod" not in q:
                return f"Decentrawood DEOD token price: {query}"
        return query

    def needs_live_data(self, query: str) -> bool:
        q = query.lower()
        live_keywords = [
            "price", "current price", "worth", "value", "market cap",
            "trading", "volume", "listed", "listing", "exchange",
            "latest news", "today", "recent update",
        ]
        return any(kw in q for kw in live_keywords)

    def is_price_query(self, query: str) -> bool:
        return self.needs_live_data(query)
