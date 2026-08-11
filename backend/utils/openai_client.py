from infrastructure.external.openai_client import (
    get_openai_client as infra_get_openai_client,
    extract_message_content,
    extract_delta_content
)

def get_openai_client():
    return infra_get_openai_client()
