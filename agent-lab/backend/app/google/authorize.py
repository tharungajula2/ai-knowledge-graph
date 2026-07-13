import os
from google_auth_oauthlib.flow import InstalledAppFlow
from app.google.auth import CLIENT_SECRETS_FILE, TOKEN_FILE, SCOPES

def run_authorization_flow():
    """
    Runs the OAuth2 InstalledAppFlow local server authorization dance.
    This script is designed to be executed once by the user in the terminal.
    
    It will:
    1. Spawn a local web server (typically on http://localhost:8080 or random port).
    2. Open the user's default browser pointing to the Google consent screen.
    3. Receive the authorization code upon approval.
    4. Exchange the code for an Access Token and a Refresh Token.
    5. Save the credentials JSON to backend/secrets/google_token.json.
    """
    print("=" * 60)
    print("VIZIER GOOGLE WORKSPACE OAUTH AUTHORIZATION RUNNER")
    print("=" * 60)
    
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"ERROR: Client secrets file not found at: {CLIENT_SECRETS_FILE}")
        print("Please follow Phase 1.5 in the Build Guide to download client config.")
        return

    print(f"Loading client secrets from: {CLIENT_SECRETS_FILE}")
    print(f"Requesting Scopes: {SCOPES}")
    
    # Spawn the oauth flow
    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES
    )
    
    # Run the local server flow to prompt the browser consent screen.
    # Note: Using port=0 lets the OS assign a random free port automatically.
    print("\nStarting local server. A browser window should open shortly...")
    creds = flow.run_local_server(port=0)
    
    # Save the token to google_token.json
    print(f"\nAuthorization successful! Saving token to: {TOKEN_FILE}")
    with open(TOKEN_FILE, "w") as token_file:
        token_file.write(creds.to_json())
    
    print("\nAuthentication complete. Credentials file successfully generated.")
    print("=" * 60)

if __name__ == "__main__":
    run_authorization_flow()
