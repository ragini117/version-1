import os
from functools import lru_cache

from dotenv import load_dotenv


load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o")
TOP_K = int(os.getenv("TOP_K", "6"))
RERANK_TOP_K = int(os.getenv("RERANK_TOP_K", "6"))
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))
SEARCH_TIMEOUT = float(os.getenv("SEARCH_TIMEOUT", "9.0"))
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.72"))

ANSWER_THRESHOLD = float(os.getenv("ANSWER_THRESHOLD", "0.55"))
# Calibrated against real decentrawood_routes scores (all-MiniLM-L6-v2):
# correct-match top scores observed in the 0.45-0.79 range (Staking 0.45,
# KYA 0.50, Blog 0.61-0.68, News 0.80), while genuinely irrelevant queries
# top out around ~0.33. 0.65 (previous default) rejected most legitimate
# matches. NAVIGATION_MARGIN is the real safety net against confidently-
# wrong top matches with a close runner-up (e.g. tight ties between an
# overview page and a specific feature page).
NAVIGATION_THRESHOLD = float(os.getenv("NAVIGATION_THRESHOLD", "0.40"))
# 0.05 rejected legitimate close calls (e.g. DEOD Tokenomics vs Trade page,
# both genuinely DEOD-related, margin ~0.018), while 0.015 still correctly
# blocks true ambiguity (e.g. "games" query: overview page vs About Us,
# margin ~0.0065 — a real wrong-vs-wrong tie, not two good answers).
NAVIGATION_MARGIN = float(os.getenv("NAVIGATION_MARGIN", "0.015"))
KB_VERSION = os.getenv("KB_VERSION", "2.0")
NAVIGATION_COLLECTION = os.getenv("NAVIGATION_COLLECTION", "decentrawood_routes")

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-decentrawood-jwt-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_PATH = os.getenv("QDRANT_PATH", os.path.join(BASE_DIR, "rag", "qdrant_db"))
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "decentrawood_docs")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
PORT = int(os.getenv("PORT", "5000"))
ROUTES_ENRICHED_PATH = os.getenv("ROUTES_ENRICHED_PATH", os.path.join(BASE_DIR, "data", "routes_enriched.json"))

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")

# Testing toggle — False kar dena jab production pe deploy karna ho
LOCAL_NAV_TESTING = True 

NAV_DOMAIN_MAP = {
    "https://decentrawood.com": FRONTEND_BASE_URL,
}

LIVE_DATA_KEYWORDS = [
    "price", "current price", "worth", "value", "market cap",
    "trading", "volume", "listed", "listing", "exchange",
    "latest news", "today", "recent update",
]

ALLOWED_NAV_DOMAINS = [
    "decentrawood.com",
    "localhost",
]
EXTERNAL_DOMAIN_MAP = {
    "gaming.decentrawood.com": "https://gaming.decentrawood.com/",
    "deodstaking.decentrawood.com": "https://deodstaking.decentrawood.com/",
    "deod.ai": "https://deod.ai/",
    "culture.decentrawood.com": "https://culture.decentrawood.com/",
    "glamour.decentrawood.com": "https://glamour.decentrawood.com/",
    
}
def is_navigable_url(url: str) -> bool:
    """
    True only when the URL belongs to the main Decentrawood website
    or local frontend during development.

    External subdomains/platforms return False.
    """

    if not url:
        return False

    # Relative frontend route
    if url.startswith("/"):
        return True

    try:
        from urllib.parse import urlparse

        parsed = urlparse(url)
        host = parsed.netloc.lower().split(":")[0]

        # Local frontend
        if host in {"localhost", "127.0.0.1"}:
            return True

        # ONLY main Decentrawood domain is navigable.
        if host in {
            "decentrawood.com",
            "www.decentrawood.com",
        }:
            return True

        # External subdomains/platforms are NOT navigable.
        return False

    except Exception:
        return False

def get_external_url(url: str) -> str | None:
    """
    Return the configured external URL if the URL belongs
    to a known external Decentrawood platform.
    """

    if not url:
        return None

    try:
        from urllib.parse import urlparse

        parsed = urlparse(url)
        host = parsed.netloc.lower().split(":")[0]

        return EXTERNAL_DOMAIN_MAP.get(host)

    except Exception:
        return None

PRICE_KEYWORDS = [
    "price", "current price", "worth", "value", "market cap",
    "trading", "volume", "listed", "listing", "exchange",
]

DECENTRAWOOD_TERMS = {
    "decentrawood", "deod", "tunehub", "ai studio", "glamour zone","Deod ai", "Deod Staking",
    "ariba zone", "indus zone", "cupid hub", "d-nexus", "mystical maze",
    "lord of space", "flap quest", "match mania", "heartlink",
}

WEB3_TERMS = {
    "web3", "metaverse", "blockchain", "crypto", "cryptocurrency", "token", "nft",
    "nfts", "staking", "dao", "p2e", "gamefi", "pancakeswap", "mexc",
    "bitmart", "toobit", "metamask", "coinmarketcap", "coingecko",
    "bitcoin", "btc", "ethereum", "eth", "solana", "sol", "uniswap", "binance", "coin",
}

DOMAIN_KEYWORDS = [
    "decentrawood", "deod", "deod token", "web3", "metaverse", "blockchain", "ai-powered",
    "game", "games", "gaming", "play-to-earn", "p2e", "gamefi", "deod hunt", "deod racing",
    "mystical maze", "match mania", "d-nexus", "lord of space", "word chain", "flap quest",
    "deod ai",
    "glamour zone", "ariba zone", "culture zone", "indus zone", "social zone", "cupid hub",
    "heartlink", "celebrity palace", "tunehub", "music", "token", "tokenomics", "trade",
    "trading", "exchange", "wallet", "metamask", "pancakeswap", "mexc", "bitmart", "toobit",
    "staking", "vesting", "airdrop", "rich list", "price", "dao", "governance", "proposal",
    "vote", "treasury", "nft", "nfts", "collectible", "community", "referral", "blog",
    "news", "whitepaper", "faq", "privacy", "terms", "what is decentrawood", "about decentrawood",
]


@lru_cache(maxsize=1)
def get_settings():
    return {
        "model_name": MODEL_NAME,
        "top_k": TOP_K,
        "cache_ttl": CACHE_TTL,
        "search_timeout": SEARCH_TIMEOUT,
        "similarity_threshold": SIMILARITY_THRESHOLD,
    }