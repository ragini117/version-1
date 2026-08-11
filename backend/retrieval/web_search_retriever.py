import urllib.request
import urllib.parse
import re
from utils.logger import get_logger

logger = get_logger("web_search_retriever")

_DDGO_URL = "https://html.duckduckgo.com/html/"
_TIMEOUT = 8.0

def _ddg_search(query: str, max_results: int = 5) -> list[str]:
    """Fetch text snippets from DuckDuckGo HTML search."""
    try:
        data = urllib.parse.urlencode({"q": query, "kl": "us-en"}).encode()
        req = urllib.request.Request(
            _DDGO_URL,
            data=data,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        )
        with urllib.request.urlopen(req, timeout=_TIMEOUT) as resp:
            html = resp.read().decode("utf-8", errors="replace")

        # Extract result snippets from DuckDuckGo HTML
        snippets = re.findall(
            r'class="result__snippet"[^>]*>(.*?)</a>',
            html,
            re.DOTALL | re.IGNORECASE,
        )
        # Strip HTML tags from snippets
        clean = [re.sub(r"<[^>]+>", "", s).strip() for s in snippets]
        return [s for s in clean if s][:max_results]
    except Exception as exc:
        logger.warning(f"DuckDuckGo search failed: {exc}")
        return []

class WebSearchRetriever:
    def search(self, query: str) -> str:
        """
        Performs a lightweight DuckDuckGo search and returns concatenated snippets.
        """
        logger.info(f"[WEB SEARCH] Query: {query}")
        try:
            snippets = _ddg_search(query)
            if not snippets:
                logger.warning("[WEB SEARCH] No results returned.")
                return "__ERROR__"
            result = " ".join(snippets)
            logger.info(f"[WEB SEARCH] Got {len(snippets)} snippets.")
            return result
        except Exception as exc:
            logger.error(f"[WEB SEARCH] Unexpected error: {exc}")
            return "__ERROR__"
