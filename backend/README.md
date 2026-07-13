# VIZIER - Backend Server

This is the FastAPI backend for VIZIER, your Personal AI Chief-of-Staff.

## Development Setup

1. **Virtual Environment:**
   Create and activate a virtual environment inside the `backend/` directory:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

2. **Install Dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   Copy `.env.example` to `.env` and fill in your keys:
   ```powershell
   copy .env.example .env
   ```

4. **Secrets:**
   Place your `google_oauth_client.json` credential file in `backend/secrets/`.

5. **Run Server:**
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
