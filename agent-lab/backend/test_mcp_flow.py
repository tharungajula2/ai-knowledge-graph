import httpx
import time

def test_mcp_flow():
    url = "http://127.0.0.1:8000/chat"
    payload = {
        "message": "Send a telegram message to my phone saying VIZIER IS ALIVE",
        "thread_id": "mcp-test-thread-1"
    }
    
    print("\n--- STEP 1: Sending request to /chat to trigger Telegram notify ---")
    print(f"Sending message: {payload['message']}")
    
    with httpx.stream("POST", url, json=payload, timeout=60.0) as r:
        for line in r.iter_lines():
            if line:
                print(line)
                
    time.sleep(2.0)
    
    payload2 = {
        "message": "Read my todo list from the database",
        "thread_id": "mcp-test-thread-1"
    }
    print("\n--- STEP 2: Sending request to /chat to read todo list ---")
    print(f"Sending message: {payload2['message']}")
    
    with httpx.stream("POST", url, json=payload2, timeout=60.0) as r:
        for line in r.iter_lines():
            if line:
                print(line)

if __name__ == "__main__":
    test_mcp_flow()
