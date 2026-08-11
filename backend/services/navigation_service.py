import re
from typing import Dict, Any, List, Optional
from config import ALLOWED_NAV_DOMAINS, FRONTEND_BASE_URL
from utils.url_rewrite import rewrite_navigation_url

class NavigationService:
    def __init__(self, allowed_domains: List[str] = ALLOWED_NAV_DOMAINS):
        self.allowed_domains = allowed_domains

    def is_navigable_url(self, url: str) -> bool:
        """
        True only when the URL belongs strictly to the main decentrawood.com domain
        or local frontend during development.
        """
        if not url:
            return False

        if url.startswith("/"):
            return True

        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            host = parsed.netloc.lower().split(":")[0]

            # Check if domain matches localhost/127.0.0.1 or exact domain
            if host in {"localhost", "127.0.0.1"}:
                return True
            if host in {"decentrawood.com", "www.decentrawood.com"}:
                return True
            return False
        except Exception:
            return False

    def apply_url_rewrite(self, url: Optional[str]) -> Optional[str]:
        return rewrite_navigation_url(url)

    def process_navigation(
        self,
        response_text: str,
        navigate_to: Optional[str],
        decision: Dict[str, Any],
        navigation: Dict[str, Any],
        primary_route: Optional[Dict[str, Any]] = None
    ) -> tuple[str, Optional[str], Dict[str, Any], Dict[str, Any]]:
        """
        Enforces navigation rules:
        - Internal routes -> auto navigation, strip URL from answer text.
        - External routes (subdomains, exchanges, partner sites) -> clickable link only, NEVER auto-navigate.
        """
        # Determine internal vs external based on the route's type or url properties
        is_internal = False
        url_to_check = navigate_to or (primary_route.get("url") if primary_route else None)
        
        if navigation and navigation.get("type") == "internal":
            is_internal = True
        if primary_route and primary_route.get("type") == "internal":
            is_internal = True

        # Double check domain constraints
        if url_to_check and not self.is_navigable_url(url_to_check):
            is_internal = False

        if is_internal:
            # INTERNAL ROUTE: Auto-navigate. Strip any links or localhost URLs from response text.
            if response_text:
                response_text = re.sub(r'\n\nLink:\s*https?://[^\s]+', '', response_text)
                response_text = re.sub(r'\n\nYou can (?:access|explore) [^\n]+ here:\s*https?://[^\s]+', '', response_text)
                response_text = re.sub(r'https?://localhost:\d+[^\s]*', '', response_text)
                response_text = response_text.strip()
        else:
            # EXTERNAL ROUTE: Disallow auto-navigation. Add clickable URL to the response text.
            navigate_to = None
            if isinstance(navigation, dict):
                navigation["should_navigate"] = False
                navigation["primary_route"] = None
                navigation["type"] = "external"
                navigation["route"] = None

            if isinstance(decision, dict):
                decision["type"] = "ANSWER"
                decision["navigation_required"] = False
                decision["answer_required"] = True

            # If response_text does not contain the URL, append it dynamically
            target_url = primary_route.get("url") if primary_route else None
            if response_text and target_url:
                clean_url = target_url.replace("https://", "").replace("http://", "").strip("/")
                if target_url not in response_text and clean_url not in response_text:
                    response_text = (
                        response_text.rstrip()
                        + f"\n\nYou can explore {target_url} to get more information."
                    )

        # Apply rewrite rules for local development
        navigate_to = self.apply_url_rewrite(navigate_to)
        if navigation and navigation.get("primary_route"):
            navigation["primary_route"]["url"] = self.apply_url_rewrite(navigation["primary_route"]["url"])
        if navigation and navigation.get("related_routes"):
            for route in navigation["related_routes"]:
                route["url"] = self.apply_url_rewrite(route["url"])

        return response_text, navigate_to, decision, navigation
