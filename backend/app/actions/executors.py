"""
backend/app/actions/executors.py
=================================
Block 9.2 — Write Action Executors

These functions are the ONLY code that calls Google's write APIs.
They are NEVER imported by specialist agents — only by the CLI reviewer
and the FastAPI approval endpoints.

CRITICAL SAFETY RULES (enforced at code level):
1. Every executor checks status == 'approved' before doing anything.
   If status is anything else (including 'proposed'), it refuses to run.
2. Every executor checks status == 'executed' and returns early if already done.
   This is the IDEMPOTENCY GUARD — the same proposal can be approved
   twice without causing a double-send/double-create.
3. On success: sets status='executed', executed_at=now(), result=<api_response>
4. On failure: sets status='failed', result=<error_message>
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
import psycopg

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.settings import settings
from app.google.auth import get_google_credentials
from app.actions.audit import log_audit


def _parse_db_url_to_dsn(url: str) -> str:
    """Convert a postgresql:// URI to space-separated key-value DSN for psycopg."""
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


def _load_proposal(cur, proposal_id: str) -> dict:
    """Load a proposal row from the DB."""
    cur.execute(
        "SELECT id, agent, action_type, payload, risk_tier, status, idempotency_key FROM proposed_actions WHERE id = %s",
        (proposal_id,)
    )
    row = cur.fetchone()
    if not row:
        raise ValueError(f"No proposal found with id: {proposal_id}")
    return {
        "id": str(row[0]),
        "agent": row[1],
        "action_type": row[2],
        "payload": row[3],
        "risk_tier": row[4],
        "status": row[5],
        "idempotency_key": row[6],
    }


def _mark_executed(cur, proposal_id: str, result: dict):
    """Mark a proposal as executed with its API response."""
    cur.execute(
        "UPDATE proposed_actions SET status='executed', executed_at=%s, result=%s WHERE id=%s",
        (datetime.now(timezone.utc), json.dumps(result), proposal_id)
    )
    log_audit(
        actor="system",
        event_type="proposal_executed",
        details={"proposal_id": proposal_id, "result": result}
    )


def _mark_failed(cur, proposal_id: str, error: str):
    """Mark a proposal as failed with the error message."""
    cur.execute(
        "UPDATE proposed_actions SET status='failed', executed_at=%s, result=%s WHERE id=%s",
        (datetime.now(timezone.utc), json.dumps({"error": error}), proposal_id)
    )
    log_audit(
        actor="system",
        event_type="proposal_failed",
        details={"proposal_id": proposal_id, "error": error}
    )


# =====================================================================
# EXECUTOR 1: SEND EMAIL (HIGH risk)
# =====================================================================
def execute_send_email(proposal_id: str) -> dict:
    """
    Sends an email via Gmail API from an approved proposal.
    
    Payload expected:
      {"to": "email@example.com", "subject": "Subject line", "body": "Email body text"}
    """
    import base64
    from email.mime.text import MIMEText
    from googleapiclient.discovery import build

    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            proposal = _load_proposal(cur, proposal_id)
            
            # IDEMPOTENCY GUARD: already executed → return early, do not send twice
            if proposal["status"] == "executed":
                print(f"[Executor] Proposal {proposal_id} already executed. Skipping (idempotency).")
                return {"status": "already_executed", "proposal_id": proposal_id}
            
            # SAFETY GATE: must be approved by human first
            if proposal["status"] != "approved":
                raise PermissionError(
                    f"Cannot execute proposal {proposal_id}: status is '{proposal['status']}', not 'approved'. "
                    "Only approved proposals may be executed."
                )
            
            payload = proposal["payload"]
            to_addr = payload["to"]
            subject = payload["subject"]
            body = payload["body"]
            
            try:
                creds = get_google_credentials()
                service = build("gmail", "v1", credentials=creds)
                
                # Build MIME email and encode as base64url for Gmail API
                mime_msg = MIMEText(body)
                mime_msg["to"] = to_addr
                mime_msg["subject"] = subject
                raw = base64.urlsafe_b64encode(mime_msg.as_bytes()).decode()
                
                result = service.users().messages().send(
                    userId="me",
                    body={"raw": raw}
                ).execute()
                
                _mark_executed(cur, proposal_id, {"gmail_message_id": result.get("id"), "to": to_addr})
                conn.commit()
                print(f"[Executor] ✅ Email sent. Gmail message ID: {result.get('id')}")
                return {"status": "executed", "gmail_message_id": result.get("id")}
                
            except Exception as e:
                _mark_failed(cur, proposal_id, str(e))
                conn.commit()
                raise RuntimeError(f"Failed to send email: {e}") from e


# =====================================================================
# EXECUTOR 2: CREATE CALENDAR EVENT (MEDIUM risk)
# =====================================================================
def execute_create_calendar_event(proposal_id: str) -> dict:
    """
    Creates a Google Calendar event from an approved proposal.
    
    Payload expected:
      {"title": "...", "start_time": "2026-07-05T10:00:00", 
       "end_time": "2026-07-05T11:00:00", "description": "..."}
    """
    from googleapiclient.discovery import build

    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            proposal = _load_proposal(cur, proposal_id)
            
            if proposal["status"] == "executed":
                print(f"[Executor] Proposal {proposal_id} already executed. Skipping (idempotency).")
                return {"status": "already_executed", "proposal_id": proposal_id}
            
            if proposal["status"] != "approved":
                raise PermissionError(
                    f"Cannot execute proposal {proposal_id}: status is '{proposal['status']}', not 'approved'."
                )
            
            payload = proposal["payload"]
            
            try:
                creds = get_google_credentials()
                service = build("calendar", "v3", credentials=creds)
                
                event_body = {
                    "summary": payload["title"],
                    "description": payload.get("description", ""),
                    "start": {"dateTime": payload["start_time"], "timeZone": "Asia/Kolkata"},
                    "end":   {"dateTime": payload["end_time"],   "timeZone": "Asia/Kolkata"},
                }
                
                result = service.events().insert(
                    calendarId="primary",
                    body=event_body
                ).execute()
                
                _mark_executed(cur, proposal_id, {"event_id": result.get("id"), "html_link": result.get("htmlLink")})
                conn.commit()
                print(f"[Executor] ✅ Calendar event created: {result.get('htmlLink')}")
                return {"status": "executed", "event_id": result.get("id"), "html_link": result.get("htmlLink")}
                
            except Exception as e:
                _mark_failed(cur, proposal_id, str(e))
                conn.commit()
                raise RuntimeError(f"Failed to create calendar event: {e}") from e


# =====================================================================
# EXECUTOR 3: CREATE TASK (LOW risk)
# =====================================================================
def execute_create_task(proposal_id: str) -> dict:
    """
    Creates a Google Task from an approved proposal.
    
    Payload expected:
      {"title": "...", "due_date": "2026-07-05", "notes": "..."}
    """
    from googleapiclient.discovery import build

    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            proposal = _load_proposal(cur, proposal_id)
            
            if proposal["status"] == "executed":
                print(f"[Executor] Proposal {proposal_id} already executed. Skipping (idempotency).")
                return {"status": "already_executed", "proposal_id": proposal_id}
            
            if proposal["status"] != "approved":
                raise PermissionError(
                    f"Cannot execute proposal {proposal_id}: status is '{proposal['status']}', not 'approved'."
                )
            
            payload = proposal["payload"]
            
            try:
                creds = get_google_credentials()
                service = build("tasks", "v1", credentials=creds)
                
                task_body = {
                    "title": payload["title"],
                    "notes": payload.get("notes", ""),
                }
                if payload.get("due_date"):
                    # Tasks API requires RFC 3339 format
                    task_body["due"] = f"{payload['due_date']}T00:00:00.000Z"
                
                # "My Tasks" is the default task list
                result = service.tasks().insert(
                    tasklist="@default",
                    body=task_body
                ).execute()
                
                _mark_executed(cur, proposal_id, {"task_id": result.get("id"), "title": result.get("title")})
                conn.commit()
                print(f"[Executor] ✅ Task created: {result.get('title')} (id: {result.get('id')})")
                return {"status": "executed", "task_id": result.get("id")}
                
            except Exception as e:
                _mark_failed(cur, proposal_id, str(e))
                conn.commit()
                raise RuntimeError(f"Failed to create task: {e}") from e


# =====================================================================
# EXECUTOR 4: LABEL EMAIL (LOW risk)
# =====================================================================
def execute_label_email(proposal_id: str) -> dict:
    """
    Applies a Gmail label to an email from an approved proposal.
    
    Payload expected:
      {"email_id": "gmail_message_id", "label_name": "IMPORTANT"}
    """
    from googleapiclient.discovery import build

    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            proposal = _load_proposal(cur, proposal_id)
            
            if proposal["status"] == "executed":
                print(f"[Executor] Proposal {proposal_id} already executed. Skipping (idempotency).")
                return {"status": "already_executed", "proposal_id": proposal_id}
            
            if proposal["status"] != "approved":
                raise PermissionError(
                    f"Cannot execute proposal {proposal_id}: status is '{proposal['status']}', not 'approved'."
                )
            
            payload = proposal["payload"]
            email_id = payload["email_id"]
            label_name = payload["label_name"].upper()
            
            try:
                creds = get_google_credentials()
                service = build("gmail", "v1", credentials=creds)
                
                # Gmail labels use label IDs — map common names to system labels
                SYSTEM_LABELS = {
                    "IMPORTANT": "IMPORTANT",
                    "STARRED": "STARRED",
                    "UNREAD": "UNREAD",
                    "READ": None,       # Handled via removeLabelIds
                    "INBOX": "INBOX",
                    "SPAM": "SPAM",
                    "TRASH": "TRASH",
                }
                
                add_labels = []
                remove_labels = []
                if label_name == "READ":
                    remove_labels = ["UNREAD"]
                elif label_name in SYSTEM_LABELS:
                    add_labels = [SYSTEM_LABELS[label_name]]
                else:
                    add_labels = [label_name]  # Custom label by name (may fail if label doesn't exist)
                
                result = service.users().messages().modify(
                    userId="me",
                    id=email_id,
                    body={"addLabelIds": add_labels, "removeLabelIds": remove_labels}
                ).execute()
                
                _mark_executed(cur, proposal_id, {"email_id": email_id, "applied_label": label_name})
                conn.commit()
                print(f"[Executor] ✅ Label '{label_name}' applied to email {email_id}")
                return {"status": "executed", "email_id": email_id, "label_applied": label_name}
                
            except Exception as e:
                _mark_failed(cur, proposal_id, str(e))
                conn.commit()
                raise RuntimeError(f"Failed to label email: {e}") from e


# =====================================================================
# DISPATCHER: route proposal_id to the correct executor
# =====================================================================
EXECUTOR_MAP = {
    "send_email": execute_send_email,
    "create_calendar_event": execute_create_calendar_event,
    "create_task": execute_create_task,
    "label_email": execute_label_email,
}

def execute_proposal(proposal_id: str) -> dict:
    """
    Dispatch an approved proposal to its matching executor.
    Used by both the CLI reviewer and the FastAPI approval endpoint.
    Supports DEMO_MODE simulation to bypass real Google OAuth/write API calls.
    """
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            proposal = _load_proposal(cur, proposal_id)
            
            # If DEMO_MODE is active, run mock execution directly!
            if getattr(settings, "DEMO_MODE", False):
                print(f"[Demo Mode] ⚡ Simulating execution for proposal {proposal_id} ({proposal['action_type']})...")
                mock_result = {
                    "status": "simulated_executed",
                    "proposal_id": proposal_id,
                    "action_type": proposal["action_type"],
                    "payload": proposal["payload"],
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                # Mark as executed and log audit
                _mark_executed(cur, proposal_id, mock_result)
                conn.commit()
                return mock_result
    
    executor = EXECUTOR_MAP.get(proposal["action_type"])
    if not executor:
        raise ValueError(f"No executor registered for action_type: '{proposal['action_type']}'")
    
    return executor(proposal_id)
