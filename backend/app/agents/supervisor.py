import os
import sys
import json
import re
from typing import Annotated, Sequence, TypedDict, Dict, Any, Literal
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage, ToolMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from psycopg_pool import ConnectionPool
from langgraph.checkpoint.postgres import PostgresSaver

# Adjust path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.settings import settings
from app.llm.gateway import gateway
from app.agents.specialists import (
    scheduler_graph,
    scribe_graph,
    researcher_graph,
    analyst_graph
)

# =====================================================================
# 1. STATE GRAPH DEFINITION
# =====================================================================
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    scratchpad: Dict[str, str]
    next_agent: str
    visited: Annotated[list, lambda x, y: x + y]

# Pydantic schema for structured routing decision
class RouteDecision(BaseModel):
    next_agent: Literal["SCHEDULER", "SCRIBE", "RESEARCHER", "ANALYST", "FINALIZE"] = Field(
        description="The next specialized agent to route to. Choose FINALIZE when query is resolved."
    )
    rationale: str = Field(description="The reasoning behind selecting the agent or finalizing.")
    task_brief: str = Field(description="Actionable instruction context for the selected specialist.")

# =====================================================================
# 2. SUPERVISOR DECISION NODE
# =====================================================================
def call_supervisor(state: AgentState) -> Dict[str, Any]:
    """
    Supervisor inspects messages and scratchpad history to route execution.
    """
    user_query = ""
    for m in reversed(state["messages"]):
        if isinstance(m, HumanMessage):
            user_query = m.content
            break
            
    memories_str = ""
    if user_query:
        try:
            from app.rag.memory import get_relevant_memories
            mems = get_relevant_memories(user_query, limit=3)
            if mems:
                memories_str = "\n".join(f"- {m['content']} ({m['kind']})" for m in mems)
        except Exception as e:
            print(f"[Memory System Error] Failed to retrieve memories for supervisor: {e}")

    # Build list of messages
    system_prompt = (
        "You are VIZIER's Supervisor Agent. Your role is to coordinate a team of four specialized agents:\n"
        "- SCHEDULER: Handles time, Google Calendar queries (upcoming events), and dates.\n"
        "- SCRIBE: Handles message/email drafting, email reading (recent inbox messages), and sending push notification alerts to the user's phone via Telegram.\n"
        "- RESEARCHER: Gathers news/facts via web search or fetch.\n"
        "- ANALYST: Financial lookups (stock symbols) and complex math equations.\n\n"
    )
    
    if memories_str:
        system_prompt += f"What I know about my principal (relevant long-term memories):\n{memories_str}\n\n"

    system_prompt += (
        "Analyze the user request and scratchpad. If the query requires research, run RESEARCHER. "
        "Choose FINALIZE when you have obtained all the necessary details to answer the user's prompt.\n\n"
        "Scratchpad content:\n" + json.dumps(state.get("scratchpad", {}), indent=2) + "\n\n"
        "Reply with a JSON object containing keys: 'next_agent', 'rationale', 'task_brief'. Only choose FINALIZE when all facts are gathered."
    )
    
    # Bridge messages to gateway format
    gateway_messages = [{"role": "system", "content": system_prompt}]
    for m in state["messages"]:
        if isinstance(m, SystemMessage):
            gateway_messages.append({"role": "system", "content": m.content})
        elif isinstance(m, HumanMessage):
            gateway_messages.append({"role": "user", "content": m.content})
        elif isinstance(m, AIMessage):
            gateway_messages.append({"role": "assistant", "content": m.content})
        elif isinstance(m, ToolMessage):
            gateway_messages.append({"role": "tool", "name": m.name, "content": m.content, "tool_call_id": m.tool_call_id})

    # Call gateway for JSON output
    res = gateway.complete(gateway_messages, response_format={"type": "json_object"}, reasoning=True)
    reply_content = res["reply"].strip()
    
    # Parse structured JSON decision
    try:
        data = json.loads(reply_content)
        decision = RouteDecision(**data)
    except Exception as e:
        print(f"[Supervisor Error] Failed to parse JSON routing: {e}. Raw: {reply_content}")
        # Default fallback to finalize on error
        decision = RouteDecision(
            next_agent="FINALIZE",
            rationale=f"Failed to parse model JSON: {e}",
            task_brief="Synthesize final answer based on current information."
        )

    chosen_agent = decision.next_agent
    visited_list = state.get("visited") or []
    if chosen_agent in visited_list:
        print(f"\n[Supervisor Loop Guard] Agent '{chosen_agent}' has already been visited in: {visited_list}. Overriding choice to FINALIZE.")
        chosen_agent = "FINALIZE"

    print(f"\n[Supervisor Route] Choice: {chosen_agent} | Rationale: {decision.rationale}")
    
    # Store routing choice in next_agent state
    return {"next_agent": chosen_agent, "visited": [chosen_agent] if chosen_agent != "FINALIZE" else []}

# =====================================================================
# 3. SPECIALIST WRAPPER NODES (CREATING THE SUBGRAPH INTERFACE)
# =====================================================================
def run_scheduler(state: AgentState) -> Dict[str, Any]:
    print("[Agent Activity] Running SCHEDULER specialist...")
    res = scheduler_graph.invoke({
        "messages": state["messages"],
        "scratchpad": state["scratchpad"]
    })
    new_scratchpad = dict(state["scratchpad"])
    new_scratchpad["SCHEDULER"] = res["messages"][-1].content
    new_msgs = [res["messages"][-1]]
    return {
        "messages": new_msgs,
        "scratchpad": new_scratchpad,
        "next_agent": "supervisor"
    }

def run_scribe(state: AgentState) -> Dict[str, Any]:
    print("[Agent Activity] Running SCRIBE specialist...")
    res = scribe_graph.invoke({
        "messages": state["messages"],
        "scratchpad": state["scratchpad"]
    })
    new_scratchpad = dict(state["scratchpad"])
    new_scratchpad["SCRIBE"] = res["messages"][-1].content
    new_msgs = [res["messages"][-1]]
    return {
        "messages": new_msgs,
        "scratchpad": new_scratchpad,
        "next_agent": "supervisor"
    }

def run_researcher(state: AgentState) -> Dict[str, Any]:
    print("[Agent Activity] Running RESEARCHER specialist...")
    res = researcher_graph.invoke({
        "messages": state["messages"],
        "scratchpad": state["scratchpad"]
    })
    new_scratchpad = dict(state["scratchpad"])
    new_scratchpad["RESEARCHER"] = res["messages"][-1].content
    new_msgs = [res["messages"][-1]]
    return {
        "messages": new_msgs,
        "scratchpad": new_scratchpad,
        "next_agent": "supervisor"
    }

def run_analyst(state: AgentState) -> Dict[str, Any]:
    print("[Agent Activity] Running ANALYST specialist...")
    res = analyst_graph.invoke({
        "messages": state["messages"],
        "scratchpad": state["scratchpad"]
    })
    new_scratchpad = dict(state["scratchpad"])
    new_scratchpad["ANALYST"] = res["messages"][-1].content
    new_msgs = [res["messages"][-1]]
    return {
        "messages": new_msgs,
        "scratchpad": new_scratchpad,
        "next_agent": "supervisor"
    }

# =====================================================================
# 4. FINALIZATION NODE
# =====================================================================
def finalize_response(state: AgentState) -> Dict[str, Any]:
    """
    Synthesizes the final output after specialists have populated the scratchpad.
    """
    print("[Agent Activity] Composing final summary...")
    
    user_query = ""
    for m in reversed(state["messages"]):
        if isinstance(m, HumanMessage):
            user_query = m.content
            break
            
    memories_str = ""
    if user_query:
        try:
            from app.rag.memory import get_relevant_memories
            mems = get_relevant_memories(user_query, limit=3)
            if mems:
                memories_str = "\n".join(f"- {m['content']} ({m['kind']})" for m in mems)
        except Exception as e:
            print(f"[Memory System Error] Failed to retrieve memories for finalizer: {e}")

    system_prompt = (
        "You are VIZIER's Supervisor Agent. Synthesize a unified, polished final answer "
        "incorporating details, drafts, or statistics retrieved by specialized agents from the scratchpad.\n\n"
    )
    
    if memories_str:
        system_prompt += f"Use these details about the user if relevant (from long-term memory):\n{memories_str}\n\n"

    system_prompt += (
        "Scratchpad Content:\n" + json.dumps(state.get("scratchpad", {}), indent=2) + "\n\n"
        "Provide a direct response to the user's initial prompt. Do not mention the word 'scratchpad' or 'specialist' directly unless asked."
    )
    
    gateway_messages = [{"role": "system", "content": system_prompt}]
    for m in state["messages"]:
        if isinstance(m, HumanMessage):
            gateway_messages.append({"role": "user", "content": m.content})

    res = gateway.complete(gateway_messages)
    reply = res["reply"]
    
    return {"messages": [AIMessage(content=reply)]}

# =====================================================================
# 5. ROUTING LOGIC
# =====================================================================
def router_fn(state: AgentState) -> Literal["SCHEDULER", "SCRIBE", "RESEARCHER", "ANALYST", "FINALIZE"]:
    return state["next_agent"]

def extract_memories_node(state: AgentState) -> Dict[str, Any]:
    print("[Agent Activity] Running memory extraction node...")
    try:
        from app.rag.memory import extract_and_save_memories
        extract_and_save_memories(state["messages"])
    except Exception as e:
        print(f"[Memory System Error] Failed in memory extraction node: {e}")
    return {}

# =====================================================================
# 6. COMPILING THE SUPERVISOR GRAPH WITH CHECKPOINTER
# =====================================================================
workflow = StateGraph(AgentState)
workflow.add_node("supervisor", call_supervisor)
workflow.add_node("scheduler_node", run_scheduler)
workflow.add_node("scribe_node", run_scribe)
workflow.add_node("researcher_node", run_researcher)
workflow.add_node("analyst_node", run_analyst)
workflow.add_node("finalize_node", finalize_response)
workflow.add_node("memory_node", extract_memories_node)

workflow.add_edge(START, "supervisor")
workflow.add_conditional_edges("supervisor", router_fn, {
    "SCHEDULER": "scheduler_node",
    "SCRIBE": "scribe_node",
    "RESEARCHER": "researcher_node",
    "ANALYST": "analyst_node",
    "FINALIZE": "finalize_node"
})

workflow.add_edge("scheduler_node", "supervisor")
workflow.add_edge("scribe_node", "supervisor")
workflow.add_edge("researcher_node", "supervisor")
workflow.add_edge("analyst_node", "supervisor")
workflow.add_edge("finalize_node", "memory_node")
workflow.add_edge("memory_node", END)

# Helper to build psycopg connection DSN
def parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"

dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)

# Setup checkpointer
pool = ConnectionPool(dsn, max_size=5)
checkpointer = PostgresSaver(pool)

# We do not run setup() here because create_checkpoint_tables.py has already set up 
# the checkpoint tables in Supabase Postgres.

supervisor_agent = workflow.compile(checkpointer=checkpointer)
