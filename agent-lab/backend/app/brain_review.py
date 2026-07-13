import os
import sys
import json
import datetime
import re

# Adjust path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.settings import settings
from app.llm.gateway import gateway

def run_self_review():
  print("--- Starting VIZIER AI Brain Self-Review ---")
  
  repo_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
  index_path = os.path.join(repo_root, 'brain', 'brain-index.json')
  
  if not os.path.exists(index_path):
    print(f"Error: brain-index.json not found at {index_path}. Make sure to run scan.js first.")
    sys.exit(1)
    
  # 1. Parse current index
  with open(index_path, 'r', encoding='utf-8') as f:
    data = json.load(f)
    
  nodes = data.get('nodes', [])
  edges = data.get('edges', [])
  
  # Group notes by domain and count
  domain_counts = {}
  notes_list = []
  
  for node in nodes:
    if node.get('type') in ['knowledge', 'feynman']:
      domain = node.get('domain', 'none')
      domain_counts[domain] = domain_counts.get(domain, 0) + 1
      notes_list.append({
        'id': node['id'],
        'title': node['label'],
        'domain': domain,
        'path': node.get('path', '')
      })
      
  # 2. Check for missing honest limits section in Feynman and Knowledge notes
  notes_missing_limits = []
  
  for note in notes_list:
    full_path = os.path.join(repo_root, note['path'])
    if os.path.exists(full_path):
      with open(full_path, 'r', encoding='utf-8') as nf:
        content = nf.read()
        # Look for the required "Where this could be wrong" heading
        if not re.search(r'##\s+Where this could be wrong|##\s+What\'s still debated', content, re.IGNORECASE):
          notes_missing_limits.append(note['title'])
          
  # Calculate thinnest domains
  domains_sorted = sorted(domain_counts.items(), key=lambda x: x[1])
  thinnest_domains = [d[0] for d in domains_sorted[:3]]
  
  # Format graph state for LLM context
  graph_summary = {
    'total_nodes': len(nodes),
    'total_edges': len(edges),
    'domain_distribution': domain_counts,
    'recent_notes': [{'title': n['title'], 'domain': n['domain']} for n in notes_list[-15:]],
    'notes_missing_honesty_check': notes_missing_limits
  }
  
  # 3. Call LLM reasoning tier to generate review
  prompt = f"""You are VIZIER's Knowledge Graph Self-Reviewer. Analyze the following knowledge graph summary:
{json.dumps(graph_summary, indent=2)}

Generate a weekly self-review report containing ONLY proposals for the user to act on. 
Follow this strict structure:
# VIZIER Weekly Self-Review - {datetime.date.today().strftime('%B %d, %Y')}

## 1. Suggested Internal Wiki-Links
- Propose 3 to 5 realistic [[wiki-link]] connections between existing notes listed under 'recent_notes' that share logical dependencies (e.g. connecting a gut microbiome note to a mind-gut note). Explain why in one sentence.

## 2. Thin Domains & Content Gaps
- Identify the thinnest domains from the graph and propose exactly three specific, concrete article/note topics for each to help balance the knowledge base.

## 3. Honesty & Safety Flags
- List any notes flagged under 'notes_missing_honesty_check' that are missing the mandatory 'Where this could be wrong' critical thinking section. Instruct the user to add it.

Respond ONLY with clean markdown. Do not modify any files directly.
"""

  print("Consulting VIZIER reasoning model tier for suggestions...")
  try:
    res = gateway.complete(
      messages=[{"role": "user", "content": prompt}],
      reasoning=True
    )
    reply = res["reply"]
    
    # Ensure reviews directory exists
    reviews_dir = os.path.join(repo_root, 'brain', 'reviews')
    os.makedirs(reviews_dir, exist_ok=True)
    
    # Save review file
    date_str = datetime.date.today().strftime('%Y-%m-%d')
    review_filename = f"{date_str}-selfreview.md"
    review_path = os.path.join(reviews_dir, review_filename)
    
    with open(review_path, 'w', encoding='utf-8') as rf:
      rf.write(reply)
      
    print(f"\n✅ SUCCESS: Generated weekly self-review!")
    print(f"File saved to: brain/reviews/{review_filename}")
  except Exception as e:
    print(f"Error during self-review generation: {e}")
    sys.exit(1)

if __name__ == "__main__":
  run_self_review()
