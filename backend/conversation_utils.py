from typing import Iterable, List, Mapping


def build_conversation_messages(
    system_prompt: str,
    current_message: str,
    recent_turns: Iterable[Mapping[str, str]] | None = None,
) -> List[dict]:
    messages = [{"role": "system", "content": system_prompt}]

    for turn in recent_turns or []:
        role = turn.get("role")
        content = turn.get("content", "")
        if role and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": current_message})
    return messages
