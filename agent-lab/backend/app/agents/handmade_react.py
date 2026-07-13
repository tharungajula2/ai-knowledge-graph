import os
import sys
import re
import ast
import json
import inspect
import operator
import datetime
from typing import List, Dict, Any, Optional

# Adjust sys.path to run from the root of /backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.llm.gateway import gateway

# =====================================================================
# 1. TOOL REGISTRY & SAFE EVALUATION
# =====================================================================

# Define safe AST mathematical operators
AST_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.USub: operator.neg
}

def _safe_ast_eval(node):
    """
    Recursively evaluate an AST math node.
    Only allows basic numbers and binary/unary mathematical operations.
    """
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Constant value of type {type(node.value)} not permitted.")
    elif isinstance(node, ast.Num): # Fallback for older python versions
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

# Real tool functions
def get_current_time() -> str:
    """Returns the current date and time formatted nicely."""
    now = datetime.datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")

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

# Dictionary registry for text parsing
TOOL_REGISTRY = {
    "get_current_time": get_current_time,
    "calculator": calculator,
    "fake_weather": fake_weather
}

# =====================================================================
# 2. VERSION 1: TEXT-PARSING REACT AGENT LOOP
# =====================================================================

TEXT_REACT_SYSTEM_PROMPT = """
You are a helpful AI assistant equipped with tools.
To answer user questions, you MUST follow this structured loop:

Thought: Write your reasoning about what to do next.
Action: Choose a tool to run from this list: [get_current_time, calculator, fake_weather]
Action Input: Provide the exact single text argument for the tool.

After you output Action and Action Input, stop writing and wait for the Observation.
Once you receive the Observation, continue the loop.
When you have the final answer, output:

Final Answer: Provide your final response to the user.

Rules:
1. You can call one tool at a time.
2. Only write one Thought, Action, and Action Input block at a time.
3. Once you write "Action Input", STOP and do not write anything else.
"""

def run_text_react_agent(query: str, max_iterations: int = 5):
    print(f"\n[TEXT REACT AGENT] Query: '{query}'")
    print("-" * 60)
    
    messages = [
        {"role": "system", "content": TEXT_REACT_SYSTEM_PROMPT},
        {"role": "user", "content": query}
    ]

    for step in range(1, max_iterations + 1):
        print(f"\n--- STEP {step} ---")
        
        # Disable cache to see reasoning process in real time
        res = gateway.complete(messages)
        content = res["reply"]
        
        print(f"Agent Response:\n{content}")

        # Check if agent declared Final Answer
        if "Final Answer:" in content:
            final_ans = content.split("Final Answer:")[-1].strip()
            print(f"\nSuccess! Final Answer:\n{final_ans}")
            return final_ans

        # Parse Action and Action Input
        action_match = re.search(r"Action:\s*(\w+)", content)
        input_match = re.search(r"Action Input:\s*(.*)", content)

        if not action_match or not input_match:
            print("[Warning] Failed to parse action. Retrying prompt with a helper request...")
            messages.append({"role": "assistant", "content": content})
            messages.append({"role": "user", "content": "Format error. Remember to use 'Action: <tool>' and 'Action Input: <input>' and then STOP."})
            continue

        tool_name = action_match.group(1).strip()
        tool_input = input_match.group(1).strip()
        
        # Clean quotes from input
        tool_input = re.sub(r'^["\']|["\']$', '', tool_input)

        print(f"Parsed Tool Request: call '{tool_name}' with input '{tool_input}'")

        if tool_name not in TOOL_REGISTRY:
            observation = f"Error: Tool '{tool_name}' does not exist."
        else:
            try:
                # Check signature to see if arguments should be passed
                sig = inspect.signature(TOOL_REGISTRY[tool_name])
                if len(sig.parameters) == 0:
                    observation = TOOL_REGISTRY[tool_name]()
                else:
                    observation = TOOL_REGISTRY[tool_name](tool_input)
            except Exception as e:
                observation = f"Execution error in tool '{tool_name}': {e}"

        print(f"Observation Result: {observation}")

        # Feed back to messages
        messages.append({"role": "assistant", "content": content})
        messages.append({"role": "user", "content": f"Observation: {observation}"})

    print(f"\n[Text Agent] Exceeded maximum iterations of {max_iterations}.")
    return "Failed to resolve query within limit."

# =====================================================================
# 3. VERSION 2: NATIVE FUNCTION-CALLING AGENT LOOP
# =====================================================================

NATIVE_SYSTEM_PROMPT = """
You are a helpful AI assistant equipped with tools.
Resolve the user's request. Execute tool calls if necessary and compose a final response once you obtain all information.
"""

# LiteLLM compatible tool schemas
NATIVE_TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "Returns the current date and time formatted nicely. Takes no parameters.",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Evaluates basic math expressions safely. Allows numbers and +, -, *, /, **, and brackets.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "The math expression to evaluate, e.g. '(23 * 17) + 5'"
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "fake_weather",
            "description": "Returns the current weather for a given city.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "The name of the city, e.g., 'London'"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

def run_native_agent(query: str, max_iterations: int = 5):
    print(f"\n[NATIVE CALLING AGENT] Query: '{query}'")
    print("-" * 60)
    
    messages = [
        {"role": "system", "content": NATIVE_SYSTEM_PROMPT},
        {"role": "user", "content": query}
    ]

    for step in range(1, max_iterations + 1):
        print(f"\n--- STEP {step} ---")
        
        # Complete query with tool schemas
        res = gateway.complete(messages, tools=NATIVE_TOOLS_SCHEMA)
        
        reply = res["reply"]
        tool_calls = res["tool_calls"]

        if reply:
            print(f"Agent Text Reply: {reply}")
            
        if not tool_calls:
            print(f"\nSuccess! Final Answer:\n{reply}")
            return reply

        # Append assistant response containing tool call details
        messages.append({
            "role": "assistant",
            "content": reply,
            "tool_calls": tool_calls
        })

        # Process each tool call requested
        for tc in tool_calls:
            tc_id = tc["id"]
            name = tc["function"]["name"]
            arguments_str = tc["function"]["arguments"]
            
            print(f"Tool Requested: id={tc_id}, name={name}, args={arguments_str}")
            
            # Parse arguments
            try:
                args = json.loads(arguments_str) if isinstance(arguments_str, str) else arguments_str
            except Exception:
                args = {}

            # Execute tool
            if name == "get_current_time":
                result = get_current_time()
            elif name == "calculator":
                result = calculator(args.get("expression", ""))
            elif name == "fake_weather":
                result = fake_weather(args.get("city", ""))
            else:
                result = f"Error: Tool '{name}' not found."

            print(f"Tool Observation: {result}")
            
            # Append observation message
            messages.append({
                "role": "tool",
                "tool_call_id": tc_id,
                "name": name,
                "content": result
            })

    print(f"\n[Native Agent] Exceeded maximum iterations of {max_iterations}.")
    return "Failed to resolve query within limit."

# =====================================================================
# 4. DIAGNOSTIC MAIN RUNNER
# =====================================================================

if __name__ == "__main__":
    # Clear local gateway cache to demonstrate live traces
    cache_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".cache")
    if os.path.exists(cache_dir):
        import shutil
        print(f"Clearing cache at {cache_dir} for clean trace verification...")
        try:
            shutil.rmtree(cache_dir)
        except Exception:
            pass

    test_query = "what time is it and what is 23*17?"
    
    print("=" * 80)
    print("VERIFYING HANDMADE AGENT LOOP")
    print("=" * 80)
    
    # 1. Run Text ReAct Agent
    run_text_react_agent(test_query)
    
    print("\n" + "="*80 + "\n")
    
    # 2. Run Native Function Calling Agent
    run_native_agent(test_query)
    
    print("=" * 80)
