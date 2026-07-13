from mcp.server.fastmcp import FastMCP
import datetime
import httpx
import re
import psycopg
import os

# Initialize FastMCP Server
mcp = FastMCP("VizierUtils")

# Read env variables (mcp server runs as a separate process, so it can access env vars if passed or read from .env)
from dotenv import load_dotenv
# Look for .env in the parent of mcp_servers (which is backend/)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

@mcp.tool()
def get_time() -> str:
    """
    Returns the current date and time on the host machine.
    """
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@mcp.tool()
async def telegram_notify(message: str) -> str:
    """
    Sends a push notification message to the principal's phone via Telegram bot.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return "Error: Telegram bot credentials are not configured in VIZIER's environment."
        
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": f"🔔 VIZIER ALERT:\n{message}"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(url, json=payload, timeout=10.0)
            if res.status_code == 200:
                return f"Notification sent successfully: '{message}'"
            else:
                return f"Failed to send notification. Telegram API returned status code: {res.status_code}. Response: {res.text}"
        except Exception as e:
            return f"Failed to send notification due to HTTP/connection error: {e}"

def parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"

@mcp.tool()
def read_todo_list() -> str:
    """
    Reads the list of current pending to-do items from VIZIER's database.
    """
    if not SUPABASE_DB_URL:
        return "Error: Database connection is not configured."
        
    dsn = parse_db_url_to_dsn(SUPABASE_DB_URL)
    try:
        with psycopg.connect(dsn) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, task, completed, created_at 
                    FROM todos 
                    ORDER BY created_at ASC
                    """
                )
                rows = cur.fetchall()
                if not rows:
                    return "Your to-do list is empty."
                
                formatted = []
                for idx, r in enumerate(rows, 1):
                    status = "[x]" if r[2] else "[ ]"
                    formatted.append(f"{idx}. {status} {r[1]} (ID: {r[0]})")
                return "\n".join(formatted)
    except Exception as e:
        return f"Database query failed: {e}"

if __name__ == "__main__":
    # Start the FastMCP server with stdio transport by default
    mcp.run()
