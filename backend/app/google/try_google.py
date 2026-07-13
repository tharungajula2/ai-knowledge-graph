import datetime
import sys
from googleapiclient.discovery import build
from app.google.auth import get_google_credentials
from app.google.gmail_reader import list_recent_messages

def safe_print(text):
    """Helper to safely print text in Windows shells with cp1252 or other restricted encodings."""
    encoding = sys.stdout.encoding or 'utf-8'
    print(text.encode(encoding, errors='replace').decode(encoding))

def try_google_integration():
    safe_print("=" * 60)
    safe_print("TESTING GOOGLE WORKSPACE READ-ONLY API INTEGRATION")
    safe_print("=" * 60)
    
    try:
        creds = get_google_credentials()
        safe_print("[Auth] Credentials verified and active.")
    except Exception as e:
        safe_print(f"[Auth Error] Failed to retrieve valid Google credentials: {e}")
        safe_print("Please run the authorization script first:")
        safe_print("  python -m app.google.authorize")
        return

    # 1. Test Google Calendar Reading
    try:
        safe_print("\n--- Reading Calendar Events ---")
        calendar_service = build("calendar", "v3", credentials=creds)
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        safe_print("Querying upcoming primary calendar events...")
        events_result = calendar_service.events().list(
            calendarId="primary",
            timeMin=now,
            maxResults=5,
            singleEvents=True,
            orderBy="startTime"
        ).execute()
        
        events = events_result.get("items", [])
        if not events:
            safe_print("No upcoming events found in primary calendar.")
        else:
            for idx, event in enumerate(events):
                start = event["start"].get("dateTime", event["start"].get("date"))
                safe_print(f"  {idx+1}. [{start}] {event.get('summary', 'No Title')}")
    except Exception as calendar_err:
        safe_print(f"[Calendar Error] Failed to read calendar events: {calendar_err}")

    # 2. Test Gmail Reading
    try:
        safe_print("\n--- Reading Recent Email Messages ---")
        safe_print("Querying last 3 messages...")
        messages = list_recent_messages(3)
        if not messages:
            safe_print("No email messages found in your inbox.")
        else:
            for idx, msg in enumerate(messages):
                safe_print(f"  {idx+1}. From: {msg['from']}")
                safe_print(f"     Subject: {msg['subject']}")
                safe_print(f"     Date: {msg['date']}")
                safe_print(f"     Snippet: {msg['snippet'][:80]}...")
                safe_print("-" * 40)
    except Exception as gmail_err:
        safe_print(f"[Gmail Error] Failed to read email messages: {gmail_err}")
        
    safe_print("\n" + "=" * 60)

if __name__ == "__main__":
    try_google_integration()

