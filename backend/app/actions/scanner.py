"""
backend/app/actions/scanner.py
===============================
Block 10.2 — Prompt Injection Defense & Heuristic Scanner

This module implements the security scanner to defend VIZIER against
Indirect Prompt Injection attacks (the "Lethal Trifecta").

It provides:
1. Heuristic regex and keyword check for prompt injection commands.
2. Correlation analysis checking if a proposal's payload contains content
   sourced from untrusted external documents (retrieved emails or web pages).
"""

import os
import sys
import re
import psycopg
from typing import Optional, List

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


# Common prompt injection patterns (case-insensitive)
SUSPICIOUS_PATTERNS = [
    r"ignore\s+previous\s+instructions",
    r"system\s+override",
    r"instead\s*,\s*do\s+the\s+following",
    r"you\s+must\s+now\s+send",
    r"new\s+directions\s+are",
    r"do\s+not\s+ask\s+for\s+approval",
    r"bypass\s+the\s+gate",
    r"delete\s+all\s+events",
    r"forward\s+all\s+emails",
    r"send\s+email\s+to\s+attacker",
    r"disregard\s+prior\s+guidelines"
]


def scan_content_heuristics(text: str) -> bool:
    """
    Checks if a block of text contains suspicious instruction-override commands.
    Returns True if any pattern matches.
    """
    if not text:
        return False
    
    text_lower = text.lower()
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, text_lower):
            print(f"[Scanner] Flagged suspicious pattern: '{pattern}'")
            return True
            
    return False


def _get_untrusted_tool_outputs(thread_id: str) -> List[str]:
    """Retrieves all message outputs from untrusted tools (read_recent_emails, web_fetch) in the thread."""
    from app.agents.supervisor import supervisor_agent
    from langchain_core.messages import ToolMessage
    
    config = {"configurable": {"thread_id": thread_id}}
    untrusted_outputs = []
    
    try:
        state = supervisor_agent.get_state(config)
        messages = state.values.get("messages", [])
        
        for msg in messages:
            # We look for ToolMessages from untrusted APIs
            if isinstance(msg, ToolMessage) and msg.name in ("read_recent_emails", "web_fetch"):
                content = msg.content
                # If wrapped in XML delimiters, extract the inner content
                m = re.search(r"<untrusted_source_data>(.*?)</untrusted_source_data>", content, re.DOTALL)
                if m:
                    untrusted_outputs.append(m.group(1).strip())
                else:
                    untrusted_outputs.append(content.strip())
    except Exception as e:
        print(f"[Scanner Error] Failed to fetch thread history: {e}")
        
    return untrusted_outputs


def check_untrusted_correlation(payload: dict, thread_id: Optional[str]) -> bool:
    """
    Checks if the proposed payload contains text that was retrieved from
    untrusted sources (emails/web fetch) in the current conversation thread.
    
    Returns True if correlation is found.
    """
    if not thread_id:
        return False
        
    untrusted_chunks = _get_untrusted_tool_outputs(thread_id)
    if not untrusted_chunks:
        return False
        
    # Convert payload dictionary values to a single flat lowercase string
    payload_str = " ".join(str(v) for v in payload.values()).lower()
    
    # Check for text overlap
    # We clean the untrusted text and split it into sentence-like chunks of length > 15
    for chunk in untrusted_chunks:
        # Split by typical sentence delimiters
        sentences = re.split(r'[.!?\n]', chunk)
        for sentence in sentences:
            clean_sentence = sentence.strip().lower()
            # If the sentence is significant and found in the payload, flag it
            if len(clean_sentence) > 20 and clean_sentence in payload_str:
                print(f"[Scanner] Found correlation: untrusted sentence '{clean_sentence}' is in the proposal payload.")
                return True
                
    return False
