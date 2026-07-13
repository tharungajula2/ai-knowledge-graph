"""
backend/app/actions/proposer.py
================================
Block 9.2 & 10.1 — Write Actions via Proposal Gate & Safety Cockpit

This is the ONLY entry point for agents to create write actions.
Agents PROPOSE. Humans APPROVE. Executors ACT.

ARCHITECTURAL RULES (enforced at code level):
- Specialist tools import ONLY from this file (proposer.py).
- Specialist tools have NO import from executors.py.
- Proposer checks the action_permissions configuration table before inserting.
- Proposer raises an error if an action is 'blocked'.
- Proposer auto-approves low-risk actions if configured.
- Proposer sends a Telegram notification for high-risk proposed actions.
- Proposer writes an audit log entry for every proposal created.
"""

import os
import sys
import json
import uuid
import re
import psycopg
import httpx
from datetime import datetime, timezone
from typing import Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.settings import settings
from app.actions.audit import log_audit


def _parse_db_url_to_dsn(url: str) -> str:
    """Convert a postgresql:// URI to space-separated key-value DSN for psycopg."""
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


def _send_telegram_notification(proposal_id: str, agent: str, action_type: str, risk_tier: str, rationale: str, payload: dict):
    """Send a notification to the user's phone via Telegram for high-risk proposals."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        print("[Proposer] Telegram credentials not configured. Skipping alert.")
        return

    text = (
        f"⚠️ <b>VIZIER HIGH-RISK PROPOSAL</b>\n\n"
        f"<b>Agent:</b> {agent}\n"
        f"<b>Action:</b> {action_type}\n"
        f"<b>Risk:</b> {risk_tier.upper()}\n"
        f"<b>Rationale:</b> {rationale}\n\n"
        f"<b>Payload:</b>\n{json.dumps(payload, indent=2)}\n\n"
        f"🔗 <b>Approve/Reject link:</b> http://localhost:3000/approvals"
    )

    try:
        url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
        res = httpx.post(url, json={
            "chat_id": settings.TELEGRAM_CHAT_ID,
            "text": text,
            "parse_mode": "HTML"
        }, timeout=5)
        if res.status_code == 200:
            print("[Proposer] Telegram notification sent successfully.")
        else:
            print(f"[Proposer] Failed to send Telegram notification: {res.text}")
    except Exception as e:
        print(f"[Proposer] Error sending Telegram notification: {e}")


def propose_action(
    agent: str,
    action_type: str,
    payload: dict,
    risk_tier: str,
    rationale: str,
    thread_id: Optional[str] = None
) -> str:
    """
    Evaluates policy permissions, runs prompt-injection defenses, and inserts a new proposal row.
    
    Tiers Checked:
    - 'blocked': Raising an error, preventing database insert.
    - 'auto_approve_low_risk': Auto-approving if risk_tier is 'low'.
    - 'always_ask': Setting status to 'proposed'.
    
    Injection Protections:
    - Heuristics: Searches payload and rationale for instruction-override keywords.
    - Correlation: Checks thread checkpoint history to see if payload overlaps with untrusted fetched data.
    - Flagged proposals are auto-escalated to HIGH risk, forcing status='proposed' (always_ask).
    """
    if action_type not in ('send_email', 'create_calendar_event', 'create_task', 'label_email'):
        raise ValueError(f"Unknown action_type: '{action_type}'")
    if risk_tier not in ('low', 'medium', 'high'):
        raise ValueError(f"Unknown risk_tier: '{risk_tier}'")

    from app.actions.scanner import scan_content_heuristics, check_untrusted_correlation

    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    
    permission_policy = "always_ask"
    
    # 1. Fetch policy setting from DB
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT permission_tier FROM action_permissions WHERE action_type = %s",
                (action_type,)
            )
            row = cur.fetchone()
            if row:
                permission_policy = row[0]

    # 2. Enforce 'blocked' tier
    if permission_policy == "blocked":
        error_msg = f"Action '{action_type}' is BLOCKED by the safety cockpit settings."
        log_audit(
            actor="system",
            event_type="action_blocked",
            details={
                "agent": agent,
                "action_type": action_type,
                "risk_tier": risk_tier,
                "payload": payload,
                "rationale": rationale,
                "reason": "Policy set to blocked"
            }
        )
        raise PermissionError(error_msg)

    # 3. Prompt injection detection & correlation
    is_flagged = False
    flagged_reasons = []

    # Heuristics check
    payload_text = " ".join(str(v) for v in payload.values()) + " " + rationale
    if scan_content_heuristics(payload_text):
        is_flagged = True
        flagged_reasons.append("suspicious_heuristics")

    # Correlation check
    if thread_id and check_untrusted_correlation(payload, thread_id):
        is_flagged = True
        flagged_reasons.append("correlated_untrusted_source")

    # If flagged, escalate to high risk / proposed (always ask)
    if is_flagged:
        print(f"[Proposer] ⚠️ Prompt injection/correlation detected! Escalating proposal risk to HIGH. Reasons: {flagged_reasons}")
        risk_tier = "high"
        status = "proposed"
        decided_at = None
    else:
        # Determine status based on policy and risk tier
        if permission_policy == "auto_approve_low_risk" and risk_tier == "low":
            status = "approved"
            decided_at = datetime.now(timezone.utc)
        else:
            status = "proposed"
            decided_at = None

    idempotency_key = str(uuid.uuid4())
    
    # 4. Insert proposal
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO proposed_actions
                    (agent, action_type, payload, rationale, risk_tier, status, decided_at, idempotency_key)
                VALUES
                    (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (agent, action_type, json.dumps(payload), rationale, risk_tier, status, decided_at, idempotency_key)
            )
            proposal_id = str(cur.fetchone()[0])
        conn.commit()

    # 5. Log audit trail
    log_audit(
        actor="agent",
        event_type="proposal_created",
        details={
            "proposal_id": proposal_id,
            "agent": agent,
            "action_type": action_type,
            "risk_tier": risk_tier,
            "status": status,
            "payload": payload,
            "rationale": rationale,
            "policy_applied": permission_policy,
            "is_flagged": is_flagged,
            "flagged_reasons": flagged_reasons
        }
    )

    print(f"[Proposer] Created proposal {proposal_id} | status={status} | action={action_type} | risk={risk_tier}")

    # 6. If high-risk and needs approval, alert Telegram
    if status == "proposed" and risk_tier == "high":
        _send_telegram_notification(proposal_id, agent, action_type, risk_tier, rationale, payload)

    return proposal_id
