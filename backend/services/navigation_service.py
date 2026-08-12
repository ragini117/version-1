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
        or local frontend during development (i.e. it is an INTERNAL route).
        External subdomains return False.
        """
        if not url:
            return False

        if url.startswith("/"):
            return True

        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            host = parsed.netloc.lower().split(":")[0]

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
        - Internal routes  -> auto navigation, strip any URL appendages from answer text.
        - External routes  -> NO auto navigation, preserve primary_route for frontend card.
          The original route type is kept (external_subdomain / external_platform / etc.)
          so the frontend can distinguish them.
        - URLs must NEVER be appended into response_text here.
        """
        url_to_check = navigate_to or (primary_route.get("url") if primary_route else None)

        # Determine internal vs external by checking URL navigability
        is_internal = False
        if primary_route and primary_route.get("type") == "internal":
            is_internal = True
        if url_to_check and self.is_navigable_url(url_to_check):
            is_internal = True
        # Double-check: external subdomains must never auto-navigate
        if url_to_check and not self.is_navigable_url(url_to_check):
            is_internal = False

        if is_internal:
            # INTERNAL ROUTE: Auto-navigate. Strip any stray links / localhost URLs from response.
            if response_text:
                response_text = re.sub(r'\n\nLink:\s*https?://[^\s]+', '', response_text)
                response_text = re.sub(r'\n\nYou can (?:access|explore) [^\n]+ here:\s*https?://[^\s]+', '', response_text)
                response_text = re.sub(r'https?://localhost:\d+[^\s]*', '', response_text)
                response_text = response_text.strip()
        else:
            # EXTERNAL ROUTE: Disable auto-navigation. Keep primary_route intact for frontend.
            navigate_to = None
            if isinstance(navigation, dict):
                navigation["should_navigate"] = False
                # Preserve the original route type — do NOT overwrite it with "external"
                # (it may be "external_subdomain", "external_platform", etc.)

            if isinstance(decision, dict):
                decision["type"] = "ANSWER"
                decision["navigation_required"] = False
                decision["answer_required"] = True

        # Apply rewrite rules for local development
        navigate_to = self.apply_url_rewrite(navigate_to)
        if navigation and navigation.get("primary_route"):
            navigation["primary_route"]["url"] = self.apply_url_rewrite(navigation["primary_route"]["url"])
        if navigation and navigation.get("related_routes"):
            for route in navigation["related_routes"]:
                route["url"] = self.apply_url_rewrite(route["url"])

        return response_text, navigate_to, decision, navigation
