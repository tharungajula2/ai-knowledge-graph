"""
backend/app/actions/review.py
==============================
Block 9.2 — CLI Proposal Reviewer

Run as: python -m app.actions.review   (from backend/ with venv active)

This is the temporary human-approval interface for Block 9.2.
Block 10.1 will replace this with a beautiful web UI (the Approval Inbox).
Until then, this CLI lets you see pending proposals and approve/reject them.

WORKFLOW:
1. Ask VIZIER something that requires a write action ("email myself a haiku")
2. VIZIER creates a proposal row (status='proposed')
3. Run this script → it lists all pending proposals with full details
4. Type the proposal ID prefix + 'a' (approve) or 'r' (reject)
5. On approve: executor runs immediately → real action happens in the world
6. On reject: proposal is marked rejected → nothing happens
"""

import os
import sys
import json
import re
import psycopg
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.settings import settings
from app.actions.executors import execute_proposal


def _parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


RISK_COLORS = {
    "low":    "🟢 LOW",
    "medium": "🟡 MEDIUM",
    "high":   "🔴 HIGH",
}

STATUS_ICONS = {
    "proposed":  "⏳",
    "approved":  "✅",
    "rejected":  "❌",
    "executed":  "🚀",
    "failed":    "💥",
}


def list_pending_proposals(cur) -> list:
    cur.execute(
        """
        SELECT id, agent, action_type, payload, rationale, risk_tier, status, created_at
        FROM proposed_actions
        WHERE status = 'proposed'
        ORDER BY created_at ASC
        """
    )
    rows = cur.fetchall()
    return [
        {
            "id": str(r[0]),
            "agent": r[1],
            "action_type": r[2],
            "payload": r[3],
            "rationale": r[4],
            "risk_tier": r[5],
            "status": r[6],
            "created_at": r[7],
        }
        for r in rows
    ]


def list_all_proposals(cur, limit: int = 10) -> list:
    cur.execute(
        """
        SELECT id, agent, action_type, risk_tier, status, created_at
        FROM proposed_actions
        ORDER BY created_at DESC
        LIMIT %s
        """,
        (limit,)
    )
    rows = cur.fetchall()
    return [
        {
            "id": str(r[0]),
            "agent": r[1],
            "action_type": r[2],
            "risk_tier": r[3],
            "status": r[4],
            "created_at": r[5],
        }
        for r in rows
    ]


def approve_proposal(cur, proposal_id: str):
    cur.execute(
        "UPDATE proposed_actions SET status='approved', decided_at=%s WHERE id=%s AND status='proposed'",
        (datetime.now(timezone.utc), proposal_id)
    )
    from app.actions.audit import log_audit
    log_audit(
        actor="human",
        event_type="proposal_approved",
        details={"proposal_id": proposal_id, "interface": "cli"}
    )


def reject_proposal(cur, proposal_id: str):
    cur.execute(
        "UPDATE proposed_actions SET status='rejected', decided_at=%s WHERE id=%s AND status='proposed'",
        (datetime.now(timezone.utc), proposal_id)
    )
    from app.actions.audit import log_audit
    log_audit(
        actor="human",
        event_type="proposal_rejected",
        details={"proposal_id": proposal_id, "interface": "cli"}
    )


def print_proposal(p: dict, idx: int = None):
    label = f"[{idx+1}]" if idx is not None else ""
    print(f"\n{'='*60}")
    print(f"{label} Proposal ID: {p['id'][:8]}...{p['id'][-4:]}")
    print(f"    Agent:       {p['agent']}")
    print(f"    Action:      {p['action_type']}")
    print(f"    Risk:        {RISK_COLORS.get(p['risk_tier'], p['risk_tier'])}")
    print(f"    Created:     {p['created_at']}")
    print(f"    Rationale:   {p.get('rationale', 'N/A')}")
    print(f"    Payload:")
    payload = p.get("payload", {})
    for k, v in payload.items():
        val_str = str(v)[:120] + "..." if len(str(v)) > 120 else str(v)
        print(f"      {k}: {val_str}")
    print(f"{'='*60}")


def main():
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    
    print("\n" + "="*60)
    print("  VIZIER — Proposal Reviewer (Block 9.2)")
    print("  Commands: [a]pprove, [r]eject, [l]ist all, [q]uit")
    print("="*60)

    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            while True:
                pending = list_pending_proposals(cur)
                
                if not pending:
                    print("\n✅ No pending proposals. All clear!")
                    cmd = input("\nEnter 'l' to list recent history, or 'q' to quit: ").strip().lower()
                    if cmd == "l":
                        recent = list_all_proposals(cur, limit=10)
                        if not recent:
                            print("  No proposals in history yet.")
                        else:
                            print(f"\n  Recent proposals (last {len(recent)}):")
                            for r in recent:
                                icon = STATUS_ICONS.get(r["status"], "?")
                                print(f"  {icon} [{r['status'].upper():10}] {r['id'][:8]}... | {r['action_type']} | {r['risk_tier']} risk | {r['agent']} | {r['created_at']}")
                        continue
                    else:
                        print("Goodbye!")
                        break
                
                print(f"\n⏳ {len(pending)} pending proposal(s):\n")
                for i, p in enumerate(pending):
                    print_proposal(p, idx=i)
                
                print(f"\nEnter proposal ID (or number 1-{len(pending)}), then 'a'pprove or 'r'eject.")
                print("Examples:  '1a'  |  '2r'  |  '<full-uuid> a'  |  'q' to quit")
                cmd = input("\n> ").strip().lower()
                
                if cmd in ("q", "quit"):
                    print("Goodbye!")
                    break
                
                if cmd == "l":
                    recent = list_all_proposals(cur, limit=10)
                    for r in recent:
                        icon = STATUS_ICONS.get(r["status"], "?")
                        print(f"  {icon} [{r['status'].upper():10}] {r['id'][:8]}... | {r['action_type']}")
                    continue
                
                # Parse "1a", "2r", "<uuid> a", "<uuid> r"
                target_id = None
                action_char = None
                
                # Try numeric prefix: "1a", "2r"
                m = re.match(r"^(\d+)\s*([ar])$", cmd)
                if m:
                    idx = int(m.group(1)) - 1
                    action_char = m.group(2)
                    if 0 <= idx < len(pending):
                        target_id = pending[idx]["id"]
                    else:
                        print(f"❌ Invalid number. Choose 1-{len(pending)}.")
                        continue
                else:
                    # Try UUID prefix + action: "<uuid> a"
                    parts = cmd.split()
                    if len(parts) == 2 and parts[1] in ("a", "r"):
                        prefix = parts[0]
                        action_char = parts[1]
                        matches = [p for p in pending if p["id"].startswith(prefix)]
                        if len(matches) == 1:
                            target_id = matches[0]["id"]
                        elif len(matches) == 0:
                            print(f"❌ No pending proposal matching ID prefix '{prefix}'.")
                            continue
                        else:
                            print(f"❌ Ambiguous prefix '{prefix}' matches {len(matches)} proposals. Use more characters.")
                            continue
                    else:
                        print("❌ Unrecognized command. Try '1a' or '1r'.")
                        continue
                
                if action_char == "a":
                    print(f"\n⚙️  Approving proposal {target_id[:8]}...")
                    approve_proposal(cur, target_id)
                    conn.commit()
                    try:
                        result = execute_proposal(target_id)
                        print(f"\n✅ Executed successfully: {result}")
                    except Exception as e:
                        print(f"\n💥 Execution failed: {e}")
                elif action_char == "r":
                    reject_proposal(cur, target_id)
                    conn.commit()
                    print(f"\n❌ Proposal {target_id[:8]} rejected.")


if __name__ == "__main__":
    main()
