import os
import sys

# Adjust path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.settings import settings
from app.agents.specialists import researcher_graph
from langchain_core.messages import HumanMessage

def test_question(title, question, grounded):
  settings.GROUNDED_RESEARCH_MODE = grounded
  print("\n" + "="*60)
  print(f" TEST: {title}")
  print(f" Question: {question}")
  print(f" Grounded Mode: {grounded}")
  print("="*60)
  
  state = {
      "messages": [HumanMessage(content=question)],
      "scratchpad": {}
  }
  
  try:
    res = researcher_graph.invoke(state)
    print("\n--- MESSAGE HISTORY ---")
    for idx, msg in enumerate(res["messages"]):
      role = msg.__class__.__name__
      print(f"\n[{idx}] {role}:")
      if hasattr(msg, 'tool_calls') and msg.tool_calls:
        print(f"  Tool Calls: {msg.tool_calls}")
      
      content_str = str(msg.content)
      content_safe = content_str.encode('ascii', errors='replace').decode('ascii')
      print(f"  Content: {content_safe[:500]}..." if len(content_safe) > 500 else f"  Content: {content_safe}")
  except Exception as e:
    print(f"Error during test: {e}")

if __name__ == "__main__":
  # Question 1: Good sources expected (should return cited answer + tiered sources + clinician footer)
  test_question(
      "Good sources expected (Health Question)",
      "What is the effect of dietary fiber on gut microbiome diversity?",
      grounded=True
  )
  
  # Question 2: No sources expected (should abstain cleanly)
  test_question(
      "No sources expected (Unrelated/Niche Question)",
      "Explain the political climate of the Martian colony in the year 2950 based on current medical guidelines.",
      grounded=True
  )
  
  # Question 3: Non-health question with Grounded Mode OFF (normal behavior)
  test_question(
      "Normal Mode (Grounded OFF)",
      "What are the top 3 programming languages in 2026?",
      grounded=False
  )
