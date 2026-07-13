"""
backend/app/scheduler.py
=========================
Block 11.1 — Proactive Scheduled Services & Morning Briefing

This module initializes the application-level scheduler (APScheduler)
and implements background jobs:
1. Daily Morning Briefing at 07:30 (gather weather, RSS, email, calendar, audit log).
2. Weekly Review on Sundays at 18:00 (summary of completed actions & memories).

It features:
- Graceful degradation: individual failed API queries do not halt execution.
- Parallel gathering / fan-out.
- Persisting briefings to database.
- Telegram push notifications.
"""

import os
import sys
import json
import re
import datetime
import asyncio
import httpx
import feedparser
import psycopg
from typing import Dict, Any, List
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.settings import settings
from app.llm.gateway import gateway
from app.google.auth import get_google_credentials


scheduler = AsyncIOScheduler()


def _parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


# =====================================================================
# GATHERING PIPELINE (Gracefully degrading, parallel run compatible)
# =====================================================================

async def gather_weather() -> str:
    """Fetch current weather from Open-Meteo API (free, no key)."""
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={settings.WEATHER_LAT}&longitude={settings.WEATHER_LON}&current_weather=true&timezone=auto"
        async with httpx.AsyncClient() as client:
            res = await client.get(url, timeout=5)
            if res.status_code == 200:
                data = res.json().get("current_weather", {})
                temp = data.get("temperature")
                wind = data.get("windspeed")
                return f"☀️ Weather in {settings.USER_CITY}: {temp}°C, Windspeed: {wind} km/h."
            return f"⚠️ Weather API returned status code {res.status_code}."
    except Exception as e:
        return f"⚠️ Weather API unavailable: {e}"


async def gather_rss_headlines() -> str:
    """Parse top stories from TechCrunch and Hacker News RSS feeds."""
    try:
        feeds = {
            "Hacker News": "https://news.ycombinator.com/rss",
            "TechCrunch": "https://techcrunch.com/feed/"
        }
        summaries = []
        for name, url in feeds.items():
            # Run blocking parsing inside executor thread to prevent blocking event loop
            loop = asyncio.get_running_loop()
            feed = await loop.run_in_executor(None, feedparser.parse, url)
            entries = feed.entries[:3]
            headlines = [f"- {e.title} ({e.link})" for e in entries]
            summaries.append(f"📰 {name} Top Stories:\n" + "\n".join(headlines))
        return "\n\n".join(summaries)
    except Exception as e:
        return f"⚠️ RSS feeds retrieval failed: {e}"


async def gather_gmail_unread() -> str:
    """List unread emails from Gmail API (requires OAuth)."""
    try:
        from app.google.gmail_reader import list_recent_messages
        # list_recent_messages is a synchronous blocking API call, run in thread pool
        loop = asyncio.get_running_loop()
        messages = await loop.run_in_executor(None, list_recent_messages, 5)
        
        if not messages:
            return "📧 No recent unread emails found."
            
        formatted = []
        for m in messages:
            formatted.append(f"- From: {m['from']} | Subject: {m['subject']} ({m['date']})")
        return "📧 Recent Inbox Emails:\n" + "\n".join(formatted)
    except Exception as e:
        return f"⚠️ Gmail retrieval failed (OAuth consent might be expired): {e}"


async def gather_calendar_events() -> str:
    """List calendar events scheduled for today (requires OAuth)."""
    try:
        from googleapiclient.discovery import build
        
        # get_google_credentials is synchronous blocking
        loop = asyncio.get_running_loop()
        creds = await loop.run_in_executor(None, get_google_credentials)
        
        service = build("calendar", "v3", credentials=creds)
        now = datetime.datetime.now(datetime.timezone.utc)
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        end_of_day = now.replace(hour=23, minute=59, second=59, microsecond=999999).isoformat()
        
        events_result = service.events().list(
            calendarId="primary",
            timeMin=start_of_day,
            timeMax=end_of_day,
            singleEvents=True,
            orderBy="startTime"
        ).execute()
        
        events = events_result.get("items", [])
        if not events:
            return "🗓️ No calendar events scheduled for today."
            
        formatted = []
        for idx, event in enumerate(events):
            start = event["start"].get("dateTime", event["start"].get("date"))
            formatted.append(f"- [{start}] {event.get('summary', 'No Title')}")
        return "🗓️ Today's Calendar Schedule:\n" + "\n".join(formatted)
    except Exception as e:
        return f"⚠️ Calendar schedule retrieval failed: {e}"


async def gather_open_todos() -> str:
    """Retrieve outstanding tasks from our database."""
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT task FROM todos WHERE completed = FALSE ORDER BY created_at ASC")
                rows = cur.fetchall()
                if not rows:
                    return "✅ All todos are completed! No open items."
                todos = [f"- {r[0]}" for r in rows]
                return "📝 Open Todo Items:\n" + "\n".join(todos)
    except Exception as e:
        return f"⚠️ Database todos retrieval failed: {e}"


async def gather_yesterday_audit_log() -> str:
    """Retrieve security audit metrics representing completed actions from yesterday."""
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT event_type, details->>'action_type'
                    FROM audit_log
                    WHERE ts >= now() - interval '1 day'
                      AND event_type IN ('proposal_executed', 'proposal_failed', 'action_blocked')
                    ORDER BY ts ASC
                    """
                )
                rows = cur.fetchall()
                if not rows:
                    return "🛡️ No gated action events recorded in audit log yesterday."
                events = [f"- Event '{r[0]}' on action type '{r[1]}'" for r in rows]
                return "🛡️ Action Audit Log (Past 24 Hours):\n" + "\n".join(events)
    except Exception as e:
        return f"⚠️ Audit logs retrieval failed: {e}"


# =====================================================================
# SYNTHESIS & TELEGRAM DELIVERY
# =====================================================================

def _send_telegram_briefing_alert(summary_markdown: str):
    """Sends a summary notification to the user's phone via Telegram."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        print("[Scheduler] Telegram credentials not configured. Skipping alert.")
        return

    # Extract clean lines for short Telegram view
    lines = summary_markdown.split("\n")
    short_summary_lines = []
    for line in lines[:15]:
        if line.strip():
            short_summary_lines.append(line)
            
    short_summary = "\n".join(short_summary_lines)
    
    text = (
        f"☀️ <b>VIZIER MORNING BRIEFING</b>\n\n"
        f"{short_summary}\n\n"
        f"🔗 <b>Read full briefing online:</b> http://localhost:3000/briefings"
    )

    try:
        url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
        # We use a synchronous post here (it runs inside background job thread context)
        res = httpx.post(url, json={
            "chat_id": settings.TELEGRAM_CHAT_ID,
            "text": text,
            "parse_mode": "HTML"
        }, timeout=5)
        if res.status_code == 200:
            print("[Scheduler] Telegram briefing alert delivered.")
        else:
            print(f"[Scheduler] Telegram alert delivery failed: {res.text}")
    except Exception as e:
        print(f"[Scheduler] Error sending Telegram alert: {e}")


def _save_briefing(kind: str, summary: str, raw_data: dict) -> str:
    """Save the briefing to the database."""
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO briefings (kind, summary, raw_data)
                VALUES (%s, %s, %s)
                RETURNING id
                """,
                (kind, summary, json.dumps(raw_data))
            )
            briefing_id = str(cur.fetchone()[0])
        conn.commit()
    return briefing_id


# =====================================================================
# SCHEDULER JOBS DEFINITIONS
# =====================================================================

async def run_morning_briefing() -> str:
    """
    Executes the proactive Morning Briefing pipeline.
    Gathers sources in parallel, calls LLM to synthesize, saves, and notifies Telegram.
    """
    print("[Scheduler] Starting morning briefing job...")
    
    # 1. Fan-out: Gather raw sources in parallel
    results = await asyncio.gather(
        gather_weather(),
        gather_rss_headlines(),
        gather_gmail_unread(),
        gather_calendar_events(),
        gather_open_todos(),
        gather_yesterday_audit_log(),
        return_exceptions=True
    )
    
    weather_info = results[0] if not isinstance(results[0], Exception) else "⚠️ Weather unavailable"
    rss_info = results[1] if not isinstance(results[1], Exception) else "⚠️ RSS feeds unavailable"
    gmail_info = results[2] if not isinstance(results[2], Exception) else "⚠️ Email inbox unavailable"
    calendar_info = results[3] if not isinstance(results[3], Exception) else "⚠️ Calendar schedule unavailable"
    todos_info = results[4] if not isinstance(results[4], Exception) else "⚠️ Todos unavailable"
    audit_info = results[5] if not isinstance(results[5], Exception) else "⚠️ Audit logs unavailable"

    raw_data = {
        "weather": weather_info,
        "rss": rss_info,
        "gmail": gmail_info,
        "calendar": calendar_info,
        "todos": todos_info,
        "audit": audit_info
    }

    # 2. Synthesis: Pass context to LLM Gateway
    prompt = (
        "You are VIZIER's Proactive Chief-of-Staff. Synthesize the following raw context inputs "
        "into a clean, professional, and well-structured Morning Briefing in Markdown format.\n\n"
        "Keep the content extremely practical, focus on upcoming schedule bottlenecks, inbox unreads, "
        "outstanding todos, and notable news headlines. Add a brief security summary based on yesterday's audit logs.\n\n"
        "RAW CONTEXT:\n"
        f"1. {weather_info}\n\n"
        f"2. {calendar_info}\n\n"
        f"3. {gmail_info}\n\n"
        f"4. {todos_info}\n\n"
        f"5. {rss_info}\n\n"
        f"6. {audit_info}\n"
    )

    try:
        messages = [
            {"role": "system", "content": "You are VIZIER's personal chief of staff, writing a daily morning brief. Keep tone crisp, clean, and helpful."},
            {"role": "user", "content": prompt}
        ]
        
        print("[Scheduler] Sending raw data to LiteLLM Gateway for synthesis...")
        res = gateway.complete(messages)
        summary = res["reply"]
        
        # 3. Save to DB
        briefing_id = _save_briefing("morning_briefing", summary, raw_data)
        print(f"[Scheduler] Briefing {briefing_id} saved to DB.")
        
        # 4. Notify via Telegram
        _send_telegram_briefing_alert(summary)
        
        return summary
    except Exception as ex:
        err_msg = f"Failed to synthesize morning briefing: {ex}"
        print(f"[Scheduler Error] {err_msg}")
        return err_msg


async def run_weekly_review() -> str:
    """
    Executes the Weekly Review pipeline.
    Reflects on audit logs, memories, and task status to outline next week's focuses.
    """
    print("[Scheduler] Starting weekly review job...")
    
    # 1. Gather weekly audit logs and memories
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    audit_data = ""
    memories_data = ""
    
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT event_type, count(*)
                    FROM audit_log
                    WHERE ts >= now() - interval '7 days'
                    GROUP BY event_type
                    """
                )
                rows = cur.fetchall()
                audit_data = "\n".join([f"- {r[0]}: {r[1]} occurrences" for r in rows])
                
                cur.execute(
                    "SELECT content FROM memories ORDER BY created_at DESC LIMIT 10"
                )
                rows_mem = cur.fetchall()
                memories_data = "\n".join([f"- {r[0]}" for r in rows_mem])
    except Exception as e:
        audit_data = f"⚠️ Failed to retrieve weekly audit metrics: {e}"

    raw_data = {"audit_summary": audit_data, "memories": memories_data}

    prompt = (
        "You are VIZIER's Proactive Chief-of-Staff. Synthesize the following raw weekly data "
        "into a structured Weekly Review in Markdown format.\n\n"
        "Structure it with sections:\n"
        "- **Weekly Accomplishments**: summary based on safety audit operations.\n"
        "- **Context & Memories**: details on new preferences learned.\n"
        "- **Action Items & Priorities**: recommended focuses for next week.\n\n"
        "RAW WEEKLY DATA:\n"
        f"Audit Events (Past 7 Days):\n{audit_data}\n\n"
        f"Recent Memories & Context:\n{memories_data}\n"
    )

    try:
        messages = [
            {"role": "system", "content": "You are VIZIER's personal chief of staff, writing a weekly reflection review. Be professional, analytical, and highly structured."},
            {"role": "user", "content": prompt}
        ]
        
        print("[Scheduler] Sending weekly data to LiteLLM Gateway for synthesis...")
        res = gateway.complete(messages)
        summary = res["reply"]
        
        # Save to DB
        briefing_id = _save_briefing("weekly_review", summary, raw_data)
        print(f"[Scheduler] Weekly review {briefing_id} saved to DB.")
        
        # Notify via Telegram
        _send_telegram_briefing_alert(summary)
        
        return summary
    except Exception as ex:
        err_msg = f"Failed to synthesize weekly review: {ex}"
        print(f"[Scheduler Error] {err_msg}")
        return err_msg


# =====================================================================
# INITIALIZATION & TRIGGERS
# =====================================================================

def init_scheduler():
    """Register cron jobs with coalescing and misfire grace configurations."""
    # Morning Briefing daily at 07:30
    scheduler.add_job(
        run_morning_briefing,
        trigger=CronTrigger(hour=7, minute=30),
        id="morning_briefing_job",
        name="Daily Morning Briefing at 07:30",
        misfire_grace_time=3600, # 1 hour grace if host machine was sleeping
        coalesce=True,           # merge multiple missed triggers into one run
        replace_existing=True
    )
    
    # Weekly Review every Sunday at 18:00
    scheduler.add_job(
        run_weekly_review,
        trigger=CronTrigger(day_of_week="sun", hour=18, minute=0),
        id="weekly_review_job",
        name="Weekly Review on Sundays at 18:00",
        misfire_grace_time=3600,
        coalesce=True,
        replace_existing=True
    )
    
    print("[Scheduler] Scheduler jobs registered. Morning brief: 07:30 daily. Weekly review: Sun 18:00.")
