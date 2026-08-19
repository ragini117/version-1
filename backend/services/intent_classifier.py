from utils.logger import get_logger
from utils.openai_client import get_openai_client

logger = get_logger("intent_classifier")


class IntentClassifier:
    """
    Lightweight intent classifier to determine if a query requires live data.
    """

    def __init__(self, model_name: str = ""):
        self.client = get_openai_client()
        self.model_name = model_name

    def is_greeting(self, query: str) -> bool:
        prompt = f"""
Classify the message as GREETING or NOT_GREETING.

GREETING means casual greetings or small-talk openers.
Examples: hello, hi, hey there, good morning, what's up, how are you.

Message: "{query}"

Reply only GREETING or NOT_GREETING.
"""

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
                max_tokens=3,
            )

            return (
                response.choices[0].message.content.strip().upper()
                == "GREETING"
            )

        except Exception:
            return False

    def enhance_live_query(self, query: str) -> str:
        q = query.lower().strip()

        if any(x in q for x in ["news", "update", "recent", "latest"]):
            if not any(x in q for x in ["decentrawood", "deod", "tunehub"]):
                return f"Decentrawood news: {query}"

        if any(x in q for x in ["price", "market cap", "volume", "value", "worth"]):
            if not any(x in q for x in ["decentrawood", "deod"]):
                return f"Decentrawood DEOD token price: {query}"

        return query

    def needs_live_data(self, query: str) -> bool:
        q = query.lower()

        live_keywords = [
            "price", "current price", "worth", "value",
            "market cap", "trading", "volume", "listed",
            "listing", "exchange", "latest news",
            "today", "recent update",
        ]

        return any(kw in q for kw in live_keywords)

    def is_price_query(self, query: str) -> bool:
        return self.needs_live_data(query)

    def is_in_domain(self, query: str) -> bool:
        q = query.lower()

        domain_terms = [
            "decentrawood", "deod", "tunehub", "deod.ai",
            "web3", "blockchain", "crypto", "cryptocurrency",
            "nft", "nfts", "dao", "governance", "wallet",
            "metamask", "smart contract", "decentralized",
            "defi", "staking", "vesting", "airdrop",
            "pancakeswap", "mexc", "bitmart", "toobit",
            "coingecko", "coinmarketcap", "weex", "coindcx",
            "token", "coin", "market cap", "exchange listing",
            "metaverse", "play-to-earn", "p2e", "gamefi",
            "game", "gaming", "virtual world", "avatar",
            "ai agent", "ai studio", "generative ai",
            "autonomous agent",
            "zone", "hub", "platform", "ecosystem",
        ]

        return any(term in q for term in domain_terms)