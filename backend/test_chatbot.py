import requests
import json
import time

url = "http://localhost:5000/chat"

test_cases = [
    "what is deod token",
    "what is decentrawood",
    "i want to join decentrawood community",
    "tell me about social zone",
    "what is deod.ai",
    "tell me about gaming",
    "what is deod staking",
    "what is bitmart",
    "How can I buy DEOD token?",
    "Which exchange is recommended for new users?",
    "What is DEOD Hunt 2?",
    "How many levels does it have?",
    "what is a random unrelated topic"
]

def test():
    session_id = None
    for idx, tc in enumerate(test_cases):
        print(f"\n--- Test Case {idx + 1}: {tc} ---")
        payload = {"text": tc}
        if session_id:
            payload["session_id"] = session_id
        
        try:
            res = requests.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            session_id = data.get("session_id")
            print("Response:", data.get("response"))
            print("Navigation:", json.dumps(data.get("navigation"), indent=2))
        except Exception as e:
            print(f"Error testing '{tc}': {e}")
        time.sleep(1)

if __name__ == "__main__":
    test()
