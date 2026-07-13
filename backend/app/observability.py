"""
backend/app/observability.py
=============================
Block 12.1 — Observability, Tracing and Langfuse Integration

This module exports the callback handler used to trace agent executions,
tool invocations, and LLM completions inside Langfuse.
"""

import os
from typing import Optional, List
from app.settings import settings

def get_langfuse_callback(trace_name: str, thread_id: Optional[str] = None) -> Optional[List]:
    """
    Returns a list containing the Langfuse CallbackHandler for LangChain/LangGraph,
    or None if keys are not configured.
    """
    if not settings.LANGFUSE_PUBLIC_KEY or not settings.LANGFUSE_SECRET_KEY:
        print("[Observability] Langfuse keys not fully configured. Tracing disabled.")
        return None

    try:
        from langfuse.callback import CallbackHandler
        
        # Instantiate callback handler
        handler = CallbackHandler(
            public_key=settings.LANGFUSE_PUBLIC_KEY,
            secret_key=settings.LANGFUSE_SECRET_KEY,
            host=settings.LANGFUSE_HOST,
            trace_name=trace_name
        )
        
        # Add metadata tags if provided
        if thread_id:
            handler.trace_tags = [thread_id]
            
        print(f"[Observability] Configured Langfuse callback trace: '{trace_name}' (thread: {thread_id})")
        return [handler]
    except Exception as e:
        print(f"[Observability Error] Failed to initialize Langfuse CallbackHandler: {e}")
        return None
