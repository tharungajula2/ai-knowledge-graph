import sys
import os

# Adjust sys.path to run from the root of /backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.llm.gateway import gateway

def main():
    print("Testing VIZIER Model Gateway...")
    messages = [
        {"role": "user", "content": "Reply with exactly: VIZIER GATEWAY ONLINE"}
    ]
    
    try:
        res = gateway.complete(messages)
        print("\n================ SUCCESS ================")
        print("Response:", res["reply"])
        print("Provider Used:", res["provider_used"])
        print("Model Used:", res["model_used"])
        print("Cached:", res["cached"])
        print("=========================================")
    except Exception as e:
        print("\n================ FAILURE ================")
        print("Gateway failed:", e)
        print("=========================================")

if __name__ == "__main__":
    main()
