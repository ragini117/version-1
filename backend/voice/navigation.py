import copy
from typing import Any, Dict


def apply_voice_navigation_policy(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Disable all navigation actions for voice mode without mutating shared cache objects.

    voice_mode == true → navigation action = none (internal and external).
    """
    if not result:
        return result

    output = copy.deepcopy(result)
    output["navigate_to"] = None

    decision = output.get("decision")
    if isinstance(decision, dict):
        decision = dict(decision)
        decision["navigation_required"] = False
        if decision.get("type") == "BOTH":
            decision["type"] = "ANSWER"
        output["decision"] = decision

    navigation = output.get("navigation")
    if isinstance(navigation, dict):
        navigation = dict(navigation)
        navigation["should_navigate"] = False
        navigation["route"] = None
        navigation["type"] = "none"
        navigation["primary_route"] = None
        navigation["related_routes"] = []
        output["navigation"] = navigation

    return output


def strip_navigation_from_stream_metadata(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Remove navigation fields from SSE metadata for voice streaming responses."""
    stripped = dict(metadata)
    stripped.pop("navigate_to", None)

    decision = stripped.get("decision")
    if isinstance(decision, dict):
        decision = dict(decision)
        decision["navigation_required"] = False
        if decision.get("type") == "BOTH":
            decision["type"] = "ANSWER"
        stripped["decision"] = decision

    navigation = stripped.get("navigation")
    if isinstance(navigation, dict):
        navigation = dict(navigation)
        navigation["should_navigate"] = False
        navigation["route"] = None
        navigation["type"] = "none"
        navigation["primary_route"] = None
        navigation["related_routes"] = []
        stripped["navigation"] = navigation

    return stripped
