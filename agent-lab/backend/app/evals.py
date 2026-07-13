"""
backend/app/evals.py
=====================
Block 12.1 — Golden Evaluations & LLM-as-a-Judge Scoring Engine

This module defines the Golden Queries dataset, executes evaluation runs,
mocks external API calls to maintain pure test execution, judges outcomes
using an LLM-as-a-judge scoring model, and logs outputs to PostgreSQL.
"""

import os
import sys
import json
import uuid
import re
import psycopg
import datetime
from unittest.mock import patch, MagicMock
from typing import Dict, Any, List

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.settings import settings
from app.llm.gateway import gateway
from app.agents.supervisor import supervisor_agent
from langchain_core.messages import HumanMessage


GOLDEN_DATASET = [
    {
        "query": "schedule lunch with John tomorrow at 1pm",
        "expected_route": "SCHEDULER"
    },
    {
        "query": "send an email to boss@company.com saying I finished the work",
        "expected_route": "SCRIBE"
    },
    {
        "query": "find recent articles about quantum computing advancements",
        "expected_route": "RESEARCHER"
    },
    {
        "query": "get current stock price of Tesla",
        "expected_route": "ANALYST"
    }
]


def _parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"


def _save_eval_test(
    run_id: str,
    query: str,
    expected_route: str,
    actual_route: str,
    routing_match: bool,
    judge_score: float,
    judge_reason: str,
    raw_response: str
):
    """Inserts a single evaluation test result row into PostgreSQL."""
    dsn = _parse_db_url_to_dsn(settings.SUPABASE_DB_URL)
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO eval_runs (run_id, query, expected_route, actual_route, routing_match, judge_score, judge_reason, raw_response)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (run_id, query, expected_route, actual_route, routing_match, judge_score, judge_reason, raw_response)
            )
        conn.commit()


def run_llm_judge(query: str, expected_route: str, actual_route: str, response_text: str) -> Dict[str, Any]:
    """Uses LLM-as-a-judge to score the semantic outcome of the agent execution."""
    prompt = (
        "You are VIZIER's LLM Evaluation Judge. Your job is to grade the performance of an AI assistant "
        "on a specific test case.\n\n"
        f"Test Query: {query}\n"
        f"Expected Route: {expected_route}\n"
        f"Actual Route: {actual_route}\n"
        f"Agent Response: {response_text}\n\n"
        "Instructions:\n"
        "1. Grade the assistant on a score scale from 0.0 (total failure/nonsense) to 1.0 (perfect execution, correct routing, proper parameters proposed).\n"
        "2. Provide your explanation of the grade in 'reason'.\n"
        "3. Output your grade strictly as a JSON object with keys 'score' (float) and 'reason' (string).\n"
    )

    try:
        messages = [
            {"role": "system", "content": "You are a professional LLM testing judge. Output JSON only."},
            {"role": "user", "content": prompt}
        ]
        res = gateway.complete(messages, response_format={"type": "json_object"})
        data = json.loads(res["reply"].strip())
        return {
            "score": float(data.get("score", 0.0)),
            "reason": str(data.get("reason", "Graded by LLM Judge."))
        }
    except Exception as e:
        print(f"[Judge Error] Failed to execute LLM Judge: {e}")
        return {
            "score": 0.0,
            "reason": f"Judge failure: {e}"
        }


def run_eval_suite() -> List[Dict[str, Any]]:
    """Runs the entire Golden Evaluation dataset under active mocks, judges and saves outcomes."""
    run_id = f"run_{int(datetime.datetime.now().timestamp())}"
    print(f"[Evals] Starting Golden Evaluation suite (Run ID: {run_id})...")
    gateway.cooldowns.clear()

    # Mock definitions to isolate agent from external network calls during evals
    mock_creds = MagicMock()
    mock_gmail = []
    
    mock_ddg = [{"title": "Quantum Leap", "href": "http://quantum.org", "body": "Quantum computing holds immense promise."}]
    
    import app.google.auth
    import app.google.gmail_reader
    import app.actions.proposer
    import duckduckgo_search
    import trafilatura
    
    # Run test cases under mock patches
    with patch("app.google.auth.get_google_credentials", return_value=mock_creds), \
         patch("app.google.gmail_reader.list_recent_messages", return_value=mock_gmail), \
         patch("app.actions.proposer.propose_action", return_value="mocked-proposal-id-54321"), \
         patch("duckduckgo_search.DDGS.text", return_value=mock_ddg), \
         patch("trafilatura.extract", return_value="Mocked web scrape output content."):

        results = []
        for idx, case in enumerate(GOLDEN_DATASET):
            query = case["query"]
            expected = case["expected_route"]
            
            print(f"\n[Evals] Test {idx+1}/{len(GOLDEN_DATASET)}: Query: '{query}'")
            
            try:
                # 1. Run agent graph
                config = {"configurable": {"thread_id": f"eval-thread-{run_id}-{idx}"}}
                inputs = {
                    "messages": [HumanMessage(content=query)],
                    "scratchpad": {},
                    "visited": []
                }
                
                res = supervisor_agent.invoke(inputs, config)
                
                # 2. Extract final reply and routing
                visited = res.get("visited", [])
                actual = visited[0] if visited else "FINALIZE"
                
                # Find the final assistant response message
                final_reply = ""
                for msg in reversed(res.get("messages", [])):
                    if msg.type == "ai" and not getattr(msg, "tool_calls", None):
                        final_reply = msg.content
                        break
                
                if not final_reply and res.get("messages"):
                    final_reply = res["messages"][-1].content

                routing_match = (expected == actual)
                
                # 3. Grade using LLM-as-a-judge
                grade = run_llm_judge(query, expected, actual, final_reply)
                
                print(f"[Evals] Done. Route Match: {routing_match} | Judge Score: {grade['score']}")
                
                # 4. Save to DB
                _save_eval_test(
                    run_id=run_id,
                    query=query,
                    expected_route=expected,
                    actual_route=actual,
                    routing_match=routing_match,
                    judge_score=grade["score"],
                    judge_reason=grade["reason"],
                    raw_response=final_reply
                )
                
                results.append({
                    "query": query,
                    "expected_route": expected,
                    "actual_route": actual,
                    "routing_match": routing_match,
                    "judge_score": grade["score"],
                    "judge_reason": grade["reason"],
                    "raw_response": final_reply
                })
                
            except Exception as e:
                print(f"[Evals Error] Failed test case '{query}': {e}")
                # Save failed run row
                _save_eval_test(
                    run_id=run_id,
                    query=query,
                    expected_route=expected,
                    actual_route="ERROR",
                    routing_match=False,
                    judge_score=0.0,
                    judge_reason=f"Execution crash: {e}",
                    raw_response=""
                )
                results.append({
                    "query": query,
                    "expected_route": expected,
                    "actual_route": "ERROR",
                    "routing_match": False,
                    "judge_score": 0.0,
                    "judge_reason": f"Execution crash: {e}",
                    "raw_response": ""
                })

        return results
