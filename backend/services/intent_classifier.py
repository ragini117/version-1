from config import DECENTRAWOOD_TERMS, DOMAIN_KEYWORDS, WEB3_TERMS
from infrastructure.external.openai_client import extract_message_content, get_openai_client
from utils.logger import get_logger

logger = get_logger("intent_classifier")

class IntentClassifier:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = get_openai_client()

    def is_greeting(self, query: str) -> bool:
        greetings = [
            "hi", "hello", "hey", "hola", "howdy", "greetings", "good morning",
            "good afternoon", "good evening", "good night", "gm", "sup", "yo",
            "what's up", "whats up", "how are you", "how r u", "hii", "hiii",
            "namaste", "namaskar", "thanks", "thank you", "thankyou", "thx", "ty", "ok", "okay", "bye", "goodbye",
            "see you", "welcome", "pleased to meet", "nice to meet",
        ]
        q = query.lower().strip().rstrip("!?.,'\"")
        if q in greetings:
            return True
        return any(q.startswith(g + " ") for g in greetings)

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

    def is_relevant_for_live_agent(self, query: str) -> bool:
        q = query.lower()
        has_decentrawood = any(term in q for term in DECENTRAWOOD_TERMS)
        has_web3 = any(term in q for term in WEB3_TERMS)
        return has_decentrawood or has_web3

    def check_domain(self, query: str) -> dict:
        """
        Classifies if the query is in-scope or out-of-scope.
        Gracefully handles LLM provider failures.
        """
        if self.is_greeting(query):
            return {"is_domain": True, "confidence": 1.0}

        q_lower = query.lower()
        
        # Fast local path: if it contains very strong domain terms, mark as domain immediately
        strong_keywords = ["decentrawood", "deod", "tunehub", "glamour zone", "ariba zone", "lord of space"]
        if any(keyword in q_lower for keyword in strong_keywords):
            return {"is_domain": True, "confidence": 1.0}

        q = self.enhance_live_query(query)
        prompt = (
            f"Classify this query as IN_SCOPE (about Decentrawood, DEOD token, Web3, blockchain, gaming, DAOs, crypto) or OUT_OF_SCOPE (anything else, e.g. recipes, general world news, unrelated topics).\n"
            f"Query: '{q}'. Respond with only IN_SCOPE or OUT_OF_SCOPE."
        )
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
                max_tokens=5,
            )
            result = extract_message_content(response).upper()
            is_domain = "IN_SCOPE" in result and "OUT_OF_SCOPE" not in result
            return {"is_domain": is_domain, "confidence": 0.9 if is_domain else 0.1}
        except Exception as e:
            logger.warning(f"OpenAI check_domain failed: {e}. Falling back to keyword classification.")
            # Graceful fallback: check against general DOMAIN_KEYWORDS list
            is_domain = any(topic in q_lower for topic in DOMAIN_KEYWORDS)
            return {"is_domain": is_domain, "confidence": 0.7 if is_domain else 0.0}
