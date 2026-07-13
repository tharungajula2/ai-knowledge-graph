"""
backend/app/actions/audit.py
=============================
Block 10.1 — Audit Logger

Exposes a shared helper to write append-only audit logs to Supabase Postgres.
"""

import os
import sys
import json
import re
import psycopg
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.settings import settings


def _parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


def log_audit(actor: str, event_type: str, details: dict) -> None:
    """
    Writes an append-only row to the audit_log table.
    
    Why append-only:
    - This table should never be updated or deleted from.
    - It provides a cryptographically trackable/tamper-evident history.
    - Used in corporate audits to trace which agent or human initiated/approved an action.
    """
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO audit_log (actor, event_type, details)
                    VALUES (%s, %s, %s)
                    """,
                    (actor, event_type, json.dumps(details))
                )
            conn.commit()
    except Exception as e:
        print(f"[Audit Log Error] Failed to write audit log: {e}")
