import base64
from googleapiclient.discovery import build
from app.google.auth import get_google_credentials

def get_gmail_service():
    """Builds and returns the Gmail API client service."""
    creds = get_google_credentials()
    return build("gmail", "v1", credentials=creds)

def _get_header(headers, name):
    """Helper to extract a specific header from Google Message details headers list."""
    for header in headers:
        if header.get("name", "").lower() == name.lower():
            return header.get("value", "")
    return ""

def _parse_message_parts(payload):
    """
    Recursively extracts the plain text body from Gmail message parts.
    
    UNDERSTANDING EMAIL MIME STRUCTURES:
    - MIME (Multipurpose Internet Mail Extensions) encodes emails as a hierarchical tree.
    - An email can be a single plain-text leaf, or multipart (e.g. multipart/mixed, multipart/alternative).
    - Multipart emails contain child parts, each with its own MIME type (e.g., text/plain, text/html, image/png).
    - This helper traverses the parts tree looking for text/plain content, decoding it from base64url format.
    """
    body = ""
    if "parts" in payload:
        for part in payload["parts"]:
            body += _parse_message_parts(part)
    else:
        mime_type = payload.get("mimeType", "")
        # Prioritize plain text bodies for LLM readability
        if mime_type == "text/plain":
            data = payload.get("body", {}).get("data", "")
            if data:
                try:
                    # Gmail base64 encodes with url-safe base64
                    decoded_bytes = base64.urlsafe_b64decode(data.encode("ASCII"))
                    body += decoded_bytes.decode("utf-8", errors="ignore")
                except Exception as e:
                    print(f"[Gmail MIME Parser] Warning: Failed to decode part body: {e}")
    return body

def get_message(msg_id: str) -> dict:
    """
    Fetches a specific message by its ID and parses it into a clean, flat dictionary.
    
    Returns:
        dict: {
            "id": msg_id,
            "threadId": thread_id,
            "subject": subject,
            "from": sender,
            "date": date_sent,
            "snippet": snippet,
            "body": plain_text_body
        }
    """
    service = get_gmail_service()
    
    # Request message format='full' to retrieve the complete MIME tree
    msg = service.users().messages().get(userId="me", id=msg_id, format="full").execute()
    
    payload = msg.get("payload", {})
    headers = payload.get("headers", [])
    
    subject = _get_header(headers, "Subject")
    sender = _get_header(headers, "From")
    date_sent = _get_header(headers, "Date")
    snippet = msg.get("snippet", "")
    
    body = _parse_message_parts(payload)
    # If recursive parsing failed to find text/plain, try falling back to the top level body data
    if not body:
        data = payload.get("body", {}).get("data", "")
        if data:
            try:
                body = base64.urlsafe_b64decode(data.encode("ASCII")).decode("utf-8", errors="ignore")
            except Exception:
                body = ""

    return {
        "id": msg_id,
        "threadId": msg.get("threadId", ""),
        "subject": subject,
        "from": sender,
        "date": date_sent,
        "snippet": snippet,
        "body": body.strip()
    }

def list_recent_messages(n: int = 5) -> list:
    """
    Lists the recent messages in the user's inbox.
    
    Returns:
        list[dict]: A list of parsed message summaries.
    """
    service = get_gmail_service()
    
    # List message metadata
    results = service.users().messages().list(userId="me", maxResults=n).execute()
    messages = results.get("messages", [])
    
    summarized_messages = []
    for msg in messages:
        try:
            parsed = get_message(msg["id"])
            summarized_messages.append(parsed)
        except Exception as e:
            print(f"[Gmail Reader] Warning: Failed to fetch message {msg['id']}: {e}")
            
    return summarized_messages

def search_messages(query: str, max_results: int = 5) -> list:
    """
    Searches for messages matching the given Gmail search query (e.g. 'from:boss standard').
    
    Returns:
        list[dict]: A list of parsed matching messages.
    """
    service = get_gmail_service()
    
    results = service.users().messages().list(userId="me", q=query, maxResults=max_results).execute()
    messages = results.get("messages", [])
    
    matching_messages = []
    for msg in messages:
        try:
            parsed = get_message(msg["id"])
            matching_messages.append(parsed)
        except Exception as e:
            print(f"[Gmail Reader] Warning: Failed to fetch searched message {msg['id']}: {e}")
            
    return matching_messages
