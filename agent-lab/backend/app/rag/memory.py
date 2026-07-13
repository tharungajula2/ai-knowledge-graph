import os
import sys
import re
import json
import psycopg
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

# Adjust path to run from root of backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.settings import settings
from app.llm.gateway import gateway

# DB DSN Parser
def parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"

class MemoryExtraction(BaseModel):
    should_remember: bool = Field(description="Set to true if this turn contains any user preferences, personal details, or persistent rules that VIZIER should remember for future conversations.")
    kind: Optional[Literal["semantic", "episodic", "procedural"]] = Field(None, description="The classification of the memory.")
    content: Optional[str] = Field(None, description="The memory content to store, phrased clearly in the third person from VIZIER's perspective. E.g. 'The principal prefers short paragraphs in drafts' or 'The principal rescheduled the dentist appointment to July 2'.")
    importance: Optional[int] = Field(None, description="Durability rating from 1 (low) to 10 (high).")

def save_memory(kind: str, content: str, importance: int) -> str:
    """
    Computes embedding of the content and stores it in the memories table.
    """
    print(f"[Memory System] Storing new {kind} memory (Importance: {importance}): '{content}'")
    try:
        embedding = gateway.embed([content])[0]
        embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    except Exception as e:
        print(f"[Memory System Error] Failed to generate embedding: {e}")
        embedding_str = None

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO memories (kind, content, importance, embedding)
                VALUES (%s, %s, %s, %s)
                RETURNING id
                """,
                (kind, content, importance, embedding_str)
            )
            memory_id = str(cur.fetchone()[0])
            print(f"[Memory System] Memory saved with ID: {memory_id}")
            return memory_id

def get_relevant_memories(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieves top-k relevant memories by embedding similarity.
    Updates last_accessed_at for retrieved memories.
    """
    print(f"[Memory System] Querying relevant memories for: '{query}'")
    try:
        query_vector = gateway.embed([query])[0]
        query_vector_str = "[" + ",".join(map(str, query_vector)) + "]"
    except Exception as e:
        print(f"[Memory System Warning] Failed to embed query: {e}. Returning no memories.")
        return []

    dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    memories = []
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            # Query top-k memories using cosine similarity <=> operator
            cur.execute(
                """
                SELECT id, kind, content, importance, created_at, last_accessed_at
                FROM memories
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> %s
                LIMIT %s
                """,
                (query_vector_str, limit)
            )
            rows = cur.fetchall()
            for r in rows:
                memories.append({
                    "id": str(r[0]),
                    "kind": r[1],
                    "content": r[2],
                    "importance": r[3],
                    "created_at": r[4].isoformat(),
                    "last_accessed_at": r[5].isoformat()
                })
            
            # Update last_accessed_at for accessed records
            if memories:
                ids = tuple(m["id"] for m in memories)
                cur.execute(
                    "UPDATE memories SET last_accessed_at = now() WHERE id = ANY(%s)",
                    (list(ids),)
                )
    
    print(f"[Memory System] Retrieved {len(memories)} matching memories.")
    return memories

def extract_and_save_memories(messages: List[Any]) -> Optional[Dict[str, Any]]:
    """
    Analyzes the latest turn of conversation to extract memories.
    """
    user_msg = ""
    assistant_msg = ""

    # Locate last assistant message
    for m in reversed(messages):
        if getattr(m, "type", "") == "ai":
            assistant_msg = m.content
            break
    
    # Locate last human message
    for m in reversed(messages):
        if getattr(m, "type", "") == "human":
            user_msg = m.content
            break

    if not user_msg or not assistant_msg:
        print("[Memory System] Skipping extraction: Missing User or Assistant message in history.")
        return None

    print(f"[Memory System] Analyzing turn for potential memories:\n  User: {user_msg[:60]}...\n  Assistant: {assistant_msg[:60]}...")

    system_prompt = (
        "You are VIZIER's Memory Extraction sub-agent.\n"
        "Your task is to analyze the conversation turn between the User (Principal) and the Assistant (VIZIER), and determine if the User has shared any long-term preferences, personal information, facts, or instructions that should be remembered across sessions.\n\n"
        "Memory kinds:\n"
        "- semantic: Long-term general facts and preferences about the User (e.g., 'User prefers 25-minute meetings', 'User has a dog named Spot').\n"
        "- episodic: Specific historical events, tasks, or interactions (e.g., 'User rescheduled their flight on July 3', 'User mentioned they met with John last Tuesday').\n"
        "- procedural: Implicit or explicit rules for how the Assistant should operate or draft content (e.g., 'Draft emails with short paragraphs and no exclamation marks', 'Always check calendar before scheduling').\n\n"
        "Instructions:\n"
        "1. Extract ONLY information that is valuable for personalizing future interactions. Do NOT extract temporary details or one-off questions (e.g., 'what time is it').\n"
        "2. Formulate the 'content' clearly in the third person (e.g., 'The principal dislikes emoji-heavy emails').\n"
        "3. Assign an importance rating from 1 to 10 based on how critical it is to get this right.\n"
        "4. Respond with a JSON object matching this schema:\n"
        "{\n"
        "  \"should_remember\": bool,\n"
        "  \"kind\": \"semantic\" | \"episodic\" | \"procedural\" | null,\n"
        "  \"content\": string | null,\n"
        "  \"importance\": int | null\n"
        "}\n"
    )

    gateway_messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Conversation Turn:\nUser: {user_msg}\nAssistant: {assistant_msg}"}
    ]

    try:
        res = gateway.complete(gateway_messages, response_format={"type": "json_object"})
        data = json.loads(res["reply"])
        extraction = MemoryExtraction(**data)
        if extraction.should_remember and extraction.kind and extraction.content:
            save_memory(
                kind=extraction.kind,
                content=extraction.content,
                importance=extraction.importance or 5
            )
            return data
        else:
            print("[Memory System] Turn analyzed. No long-term memory extraction needed.")
            return None
    except Exception as e:
        print(f"[Memory System Error] Failed during memory extraction LLM task: {e}")
        return None
