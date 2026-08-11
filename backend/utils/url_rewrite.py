from config import LOCAL_NAV_TESTING, NAV_DOMAIN_MAP


def rewrite_navigation_url(url: str | None) -> str | None:
    if not url or not LOCAL_NAV_TESTING:
        return url

    normalized = url.rstrip("/")

    # Longest prefix first, so subdomains win over the bare root domain.
    for prod_prefix in sorted(NAV_DOMAIN_MAP, key=len, reverse=True):
        prod_prefix_normalized = prod_prefix.rstrip("/")
        if normalized == prod_prefix_normalized or normalized.startswith(prod_prefix_normalized + "/"):
            local_equivalent = NAV_DOMAIN_MAP[prod_prefix].rstrip("/")
            remainder = normalized[len(prod_prefix_normalized):]  # e.g. "/what-is-decentrawood" or ""
            return local_equivalent + remainder

    return url