import os
import sys
import json
import re
import ast
import operator
import datetime
from typing import Annotated, Sequence, TypedDict, List, Dict, Any, Literal
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from psycopg_pool import ConnectionPool
from langgraph.checkpoint.postgres import PostgresSaver

# Adjust sys.path to run from the root of /backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.settings import settings
from app.llm.gateway import gateway

# =====================================================================
# 1. TOOL DEFINITIONS USING LANGCHAIN @TOOL DECORATOR
# =====================================================================

@tool
def get_current_time() -> str:
    """Returns the current date and time formatted nicely. Takes no parameters."""
    now = datetime.datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")

# AST calculator helper
AST_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg
}

def _safe_ast_eval(node):
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Constant value of type {type(node.value)} not permitted.")
    elif isinstance(node, ast.Num):
        return node.n
    elif isinstance(node, ast.BinOp):
        left = _safe_ast_eval(node.left)
        right = _safe_ast_eval(node.right)
        op_type = type(node.op)
        if op_type not in AST_OPERATORS:
            raise ValueError(f"Operator {op_type} not permitted.")
        return AST_OPERATORS[op_type](left, right)
    elif isinstance(node, ast.UnaryOp):
        operand = _safe_ast_eval(node.operand)
        op_type = type(node.op)
        if op_type not in AST_OPERATORS:
            raise ValueError(f"Operator {op_type} not permitted.")
        return AST_OPERATORS[op_type](operand)
    else:
        raise ValueError(f"AST node type {type(node)} is unsupported.")

@tool
def calculator(expression: str) -> str:
    """
    Evaluates basic math expressions safely.
    Example expression: "(23 * 17) + 5"
    """
    # Clean expression characters
    clean = re.sub(r"[^0-9\+\-\*\/\(\)\s\.]", "", expression)
    try:
        tree = ast.parse(clean.strip(), mode="eval")
        result = _safe_ast_eval(tree.body)
        return str(result)
    except Exception as e:
        return f"Error evaluating expression '{expression}': {e}"

@tool
def fake_weather(city: str) -> str:
    """Returns the current weather for a given city."""
    city_lower = city.strip().lower()
    if "london" in city_lower:
        return "12°C, Rain, Wind 24 km/h"
    elif "tokyo" in city_lower:
        return "22°C, Clear, Humidity 45%"
    elif "new york" in city_lower:
        return "18°C, Partly Cloudy, Wind 10 km/h"
    else:
        return f"Weather data not found for city '{city}'"

# Tools array
tools = [get_current_time, calculator, fake_weather]
tool_node = ToolNode(tools)

# Convert langchain tool schemas to LiteLLM compatible list
LITELLM_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": t.name,
            "description": t.description,
            "parameters": t.args_schema.schema() if t.args_schema else {"type": "object", "properties": {}}
        }
    } for t in tools
]

# =====================================================================
# 2. STATE GRAPH DEFINITION
# =====================================================================

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

def call_model(state: AgentState) -> Dict[str, Any]:
    """
    Formulates model completions by bridging LangChain messages and the LLM gateway.
    """
    # 1. Translate LangChain messages list to LiteLLM message dictionary list
    gateway_messages = []
    
    for m in state["messages"]:
        if isinstance(m, SystemMessage):
            gateway_messages.append({"role": "system", "content": m.content})
        elif isinstance(m, HumanMessage):
            gateway_messages.append({"role": "user", "content": m.content})
        elif isinstance(m, AIMessage):
            msg = {"role": "assistant", "content": m.content or ""}
            if m.tool_calls:
                msg["tool_calls"] = [
                    {
                        "id": tc["id"],
                        "type": "function",
                        "function": {
                            "name": tc["name"],
                            "arguments": json.dumps(tc["args"])
                        }
                    } for tc in m.tool_calls
                ]
            gateway_messages.append(msg)
        elif isinstance(m, ToolMessage):
            gateway_messages.append({
                "role": "tool",
                "tool_call_id": m.tool_call_id,
                "name": m.name,
                "content": m.content
            })

    # 2. Call gateway
    res = gateway.complete(gateway_messages, tools=LITELLM_TOOLS)
    
    reply = res["reply"]
    tool_calls = res["tool_calls"]

    # 3. Translate response back to LangChain AIMessage
    lc_tool_calls = []
    if tool_calls:
        for tc in tool_calls:
            tc_name = tc["function"]["name"]
            tc_args_str = tc["function"]["arguments"]
            tc_id = tc["id"]
            
            try:
                tc_args = json.loads(tc_args_str) if isinstance(tc_args_str, str) else tc_args_str
            except Exception:
                tc_args = {}
                
            lc_tool_calls.append({
                "name": tc_name,
                "args": tc_args,
                "id": tc_id
            })

    ai_msg = AIMessage(content=reply, tool_calls=lc_tool_calls)
    return {"messages": [ai_msg]}

def should_continue(state: AgentState) -> Literal["continue", "end"]:
    """
    Checks last message to route execution.
    """
    last_message = state["messages"][-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "continue"
    return "end"

# =====================================================================
# 3. COMPILING GRAPH WITH POSTGRES CHECKPOINTER
# =====================================================================

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {"continue": "tools", "end": END})
workflow.add_edge("tools", "agent")

# Convert Connection URL to standard DSN format to bypass psycopg URI parsing bugs
# (e.g. when database password contains slashes or other special characters)
def parse_db_url_to_dsn(url: str) -> str:
    m = re.match(r"postgresql://([^:]+):(.+)@([^:]+):(\d+)/(.+)", url)
    if not m:
        return url
    user, password, host, port, dbname = m.groups()
    return f"dbname={dbname} user={user} password={password} host={host} port={port}"

dsn = parse_db_url_to_dsn(settings.SUPABASE_DB_URL)

# Initialize connection pool to Supabase
pool = ConnectionPool(dsn, max_size=5)
checkpointer = PostgresSaver(pool)

# Create tables in the DB if they don't exist
try:
    print("[Core Agent] Setting up checkpointer tables in Supabase Postgres...")
    checkpointer.setup()
    print("[Core Agent] Checkpointer setup complete.")
except Exception as e:
    print(f"[Core Agent Warning] Failed checkpointer setup: {e}. Check SUPABASE_DB_URL.")

core_agent = workflow.compile(checkpointer=checkpointer)
