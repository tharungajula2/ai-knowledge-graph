import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# SCOPES define the specific access permissions we are requesting from the user.
# Block 9.1 added read-only scopes. Block 9.2 extends to write scopes for the proposal system.
# IMPORTANT: Having these scopes does NOT mean the agent can send freely.
# The proposal gate in app/actions/ enforces that only APPROVED proposals get executed.
# This is the critical distinction between "technically capable" and "safely permitted".
SCOPES = [
    # --- READ SCOPES (Block 9.1) ---
    "https://www.googleapis.com/auth/gmail.readonly",        # Read emails
    "https://www.googleapis.com/auth/calendar.readonly",     # Read calendar events

    # --- WRITE SCOPES (Block 9.2) — all gated by human approval before execution ---
    "https://www.googleapis.com/auth/gmail.send",            # Send emails (HIGH risk tier)
    "https://www.googleapis.com/auth/gmail.modify",          # Label/archive emails (LOW risk tier)
    "https://www.googleapis.com/auth/calendar.events",       # Create/modify calendar events (MEDIUM risk)
    "https://www.googleapis.com/auth/tasks",                 # Create Google Tasks (LOW risk tier)
]

# Paths for client configuration and generated credentials tokens.
# - CLIENT_SECRETS_FILE: Contains the Client ID and Client Secret downloaded from the Google Cloud Console.
# - TOKEN_FILE: Created after the user completes the OAuth consent flow in the browser. It stores
#   both the Access Token (temporary) and the Refresh Token (long-lived).
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CLIENT_SECRETS_FILE = os.path.join(BASE_DIR, "secrets", "google_oauth_client.json")
TOKEN_FILE = os.path.join(BASE_DIR, "secrets", "google_token.json")

def get_google_credentials():
    """
    Retrieves valid Google OAuth2 credentials.
    
    This function handles the lifecycle of the credentials:
    1. Loads existing token from disk (google_token.json) if it exists.
    2. Validates the token. If it is expired but has a refresh token, it automatically refreshes it.
    3. If the token is invalid, missing, or cannot be refreshed, it raises an exception so that
       the standalone authorize.py script can be run to re-run the full browser authentication flow.
       
    OAUTH2 CONCEPTS EXPLAINED:
    - Access Token: A short-lived token (usually expires in 1 hour) passed with API requests to authenticate.
    - Refresh Token: A long-lived token stored on the server/device. Used to request a new access token
      without requiring user interaction.
    - Consent Screen: The screen displayed to the user showing the app name, requested scopes, and permissions.
    - Testing Mode: In Google Cloud Console, if the OAuth consent screen is in "Testing" status, user tokens
      expire after 7 days, requiring the user to re-authenticate (re-run authorize.py) weekly.
    """
    creds = None
    
    # 1. Load the token from disk if it exists
    if os.path.exists(TOKEN_FILE):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        except Exception as e:
            print(f"[Google Auth] Warning: Failed to load credentials from token file: {e}")
            creds = None

    # 2. Check credentials validity and refresh if expired
    if creds and creds.expired and creds.refresh_token:
        try:
            print("[Google Auth] Access token expired. Attempting to refresh...")
            creds.refresh(Request())
            # Save the refreshed credentials back to disk
            with open(TOKEN_FILE, "w") as token:
                token.write(creds.to_json())
            print("[Google Auth] Token refreshed successfully.")
        except Exception as e:
            print(f"[Google Auth] Error: Failed to refresh token: {e}")
            creds = None

    # 3. If no valid credentials could be loaded or refreshed, let the caller know.
    # The application should not run InstalledAppFlow inside api threads or background runners
    # to avoid blocking or throwing interactive browser windows. Instead, we fail fast and
    # instruct the user to run authorize.py in their terminal.
    if not creds or not creds.valid:
        raise ValueError(
            f"Google credentials are missing or invalid at '{TOKEN_FILE}'. "
            "Please run 'python -m app.google.authorize' in the backend terminal to re-authorize."
        )

    return creds
