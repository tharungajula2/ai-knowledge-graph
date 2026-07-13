const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');
const ai = require('./ai/client');

const repoRoot = path.resolve(__dirname, '..');
const curriculumPath = path.join(repoRoot, 'curriculum', 'curriculum.json');
const changelogPath = path.join(repoRoot, 'curriculum', 'CHANGELOG.md');
const buildScript = path.join(repoRoot, 'tools', 'site-build', 'build.js');
const lockedDir = path.join(repoRoot, 'curriculum', '.locked');

// Helper to check if a node is locked (either has node.locked = true, or has a file in curriculum/.locked)
function isLocked(nodeId) {
  const lockPath = path.join(lockedDir, `${nodeId}.json`);
  return fs.existsSync(lockPath);
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function run() {
  console.log('\n==================================================');
  console.log('         VIZIER SYSTEM EVOLUTION: REPLAN ENGINE    ');
  console.log('==================================================\n');

  if (!fs.existsSync(curriculumPath)) {
    console.error(`Error: curriculum.json not found at ${curriculumPath}. Please run build first.`);
    process.exit(1);
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
  const currentVersion = curriculum.version || '1.0.0';
  const nodes = curriculum.nodes || [];
  const milestones = curriculum.milestones || [];

  // Filter nodes into locked (LIT) vs ghost (UNLOCKED)
  const lockedNodes = [];
  const ghostNodes = [];

  for (const node of nodes) {
    if (isLocked(node.id) || node.locked || node.status === 'lit') {
      lockedNodes.push(node);
    } else {
      ghostNodes.push(node);
    }
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('💬 What changed in the AI field or your schedule? (Free text): ', async (userReason) => {
    if (!userReason.trim()) {
      console.log('No input provided. Exiting replan.');
      rl.close();
      process.exit(0);
    }

    console.log('\n🧠 Analyzing request with Gemini...');
    console.log(`🤖 Using model: ${ai.modelName}`);

    // Prepare context to send to Gemini
    const context = {
      user_input: userReason,
      locked_node_titles: lockedNodes.map(n => ({ id: n.id, title: n.title, domain: n.domain })),
      ghost_nodes: ghostNodes.map(n => ({
        id: n.id,
        title: n.title,
        domain: n.domain,
        cluster: n.cluster,
        type: n.type,
        size: n.size,
        summary: n.summary,
        requires: n.requires
      })),
      milestones: milestones.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        related_domains: m.related_domains,
        status: m.status,
        baseline_node: m.baseline_node
      }))
    };

    const prompt = `You are VIZIER's curriculum auto-evolution engine. Your goal is to adapt the unlocked (ghost) portion of the curriculum based on the user's schedule/updates or recent developments in the AI engineering field.

User request: "${userReason}"

Current active version: ${currentVersion}

CONSTRAINTS:
1. HARD RULE: You CANNOT modify, remove, or rewire any of the locked (LIT) nodes. They are fixed context. The list of locked nodes is:
${JSON.stringify(context.locked_node_titles, null, 2)}

2. You can ONLY modify, remove, add, or rewire the following unlocked (GHOST) nodes:
${JSON.stringify(context.ghost_nodes, null, 2)}

3. You can complete milestones or update their status. The milestones are:
${JSON.stringify(context.milestones, null, 2)}

4. If a milestone is completed (e.g. user finished a project or resurrection), change its status to "lit" or "completed" and suggest repurposing its study nodes into more advanced/recent topics.

5. You must output exactly a JSON object conforming to the schema below. Do not output any conversational text or markdown code wraps. Return raw JSON.

JSON SCHEMA:
{
  "milestone_updates": [
    {
      "id": "milestone-id",
      "status": "lit" | "floating",
      "description": "updated description or reasons"
    }
  ],
  "node_changes": [
    {
      "action": "add" | "remove" | "update",
      "id": "stable-node-slug",
      "title": "Node Title",
      "domain": "foundations" | "prompting-apis" | "rag-retrieval" | "agents" | "multi-agent-mcp" | "memory-knowledge" | "evals-observability" | "safety-security" | "production" | "frontier-capstone",
      "cluster": "Cluster name",
      "type": "concept" | "build" | "deep-dive" | "synthesis" | "capstone" | "frontier",
      "size": "S" | "M" | "L",
      "summary": "1-sentence short summary of what this node covers",
      "requires": ["list-of-node-id-requirements"]
    }
  ]
}

Ensure all nodes have valid dependencies (no broken requires links). When adding nodes, make sure they are connected into the graph sequence appropriately. Provide a meaningful summary for new nodes.`;

    try {
      const response = await ai.generate(prompt, true);
      rl.close();
      
      processProposedDiff(curriculum, response, userReason);
    } catch (err) {
      console.error('\n❌ Replan generation failed:', err.message);
      rl.close();
      process.exit(1);
    }
  });
}

function processProposedDiff(curriculum, proposed, userReason) {
  // Validate changes against locked nodes
  const nodeChanges = proposed.node_changes || [];
  const milestoneUpdates = proposed.milestone_updates || [];

  const violations = [];
  for (const change of nodeChanges) {
    if (isLocked(change.id)) {
      violations.push(`Cannot ${change.action} node "${change.id}" because it is LOCKED (LIT).`);
    }
  }

  if (violations.length > 0) {
    console.error('\n🛑 REPLAN REJECTED: Gemini proposed modifications that violate locked-node constraints:');
    violations.forEach(v => console.error(`  - ${v}`));
    console.error('\nAborting replan. No files were modified.\n');
    process.exit(1);
  }

  if (nodeChanges.length === 0 && milestoneUpdates.length === 0) {
    console.log('\n🤷 No changes proposed by Gemini.');
    process.exit(0);
  }

  console.log('\n🔍 PROPOSED GRAPH REPLAN:');
  console.log('================================================================================');
  
  if (milestoneUpdates.length > 0) {
    console.log('🏆 MILESTONE UPDATES:');
    milestoneUpdates.forEach(m => {
      console.log(`  - [${m.id}] Status -> ${m.status} (${m.description})`);
    });
    console.log('');
  }

  if (nodeChanges.length > 0) {
    console.log('📦 NODE CHANGES:');
    nodeChanges.forEach((c, index) => {
      const existing = curriculum.nodes.find(n => n.id === c.id);
      console.log(`  [${index + 1}] ACTION: ${c.action.toUpperCase()} (${c.id})`);
      if (c.action === 'add') {
        console.log(`      Title:   "${c.title}"`);
        console.log(`      Domain:  ${c.domain}`);
        console.log(`      Cluster: "${c.cluster}"`);
        console.log(`      Type:    ${c.type} (${c.size})`);
        console.log(`      Summary: "${c.summary}"`);
        console.log(`      Requires: [${c.requires.join(', ')}]`);
      } else if (c.action === 'remove') {
        console.log(`      Remove existing node: "${existing ? existing.title : c.id}"`);
      } else if (c.action === 'update') {
        if (existing) {
          if (existing.title !== c.title) console.log(`      Title:   "${existing.title}" -> "${c.title}"`);
          if (existing.size !== c.size) console.log(`      Size:    ${existing.size} -> ${c.size}`);
          if (existing.cluster !== c.cluster) console.log(`      Cluster: "${existing.cluster}" -> "${c.cluster}"`);
          if (existing.summary !== c.summary) console.log(`      Summary: "${existing.summary}" -> "${c.summary}"`);
          if (JSON.stringify(existing.requires) !== JSON.stringify(c.requires)) {
            console.log(`      Requires: [${existing.requires.join(', ')}] -> [${c.requires.join(', ')}]`);
          }
        } else {
          console.log(`      Update metadata for: ${c.title}`);
        }
      }
      console.log('--------------------------------------------------------------------------------');
    });
  }

  /*
   * HITL (Human-in-the-Loop) Philosophy Gate:
   * State in a code comment:
   * VIZIER values Human-in-the-Loop (HITL) philosophy. We never apply AI recommendations
   * blindly. The user must manually review and confirm either the full set of modifications
   * or decide change-by-change.
   */
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('👉 Apply all changes? (y/n/individual): ', (choice) => {
    choice = choice.trim().toLowerCase();
    
    if (choice === 'y' || choice === 'yes') {
      rl.close();
      applyAllChanges(curriculum, proposed, userReason);
    } else if (choice === 'n' || choice === 'no') {
      console.log('\n❌ Replan discarded. No changes applied.\n');
      rl.close();
      process.exit(0);
    } else if (choice === 'individual') {
      rl.close();
      applyIndividualChanges(curriculum, proposed, userReason);
    } else {
      console.log('Invalid input. Aborting.');
      rl.close();
      process.exit(1);
    }
  });
}

function applyAllChanges(curriculum, proposed, userReason) {
  const nodeChanges = proposed.node_changes || [];
  const milestoneUpdates = proposed.milestone_updates || [];
  
  let structuralChange = false;
  let updateCount = 0;

  // Apply Milestones
  for (const mUp of milestoneUpdates) {
    const target = curriculum.milestones.find(m => m.id === mUp.id);
    if (target) {
      target.status = mUp.status;
      if (mUp.description) target.description = mUp.description;
      updateCount++;
    }
  }

  // Apply Node Changes
  for (const nc of nodeChanges) {
    if (nc.action === 'add') {
      // Add node
      curriculum.nodes.push({
        id: nc.id,
        title: nc.title,
        domain: nc.domain,
        cluster: nc.cluster,
        type: nc.type,
        size: nc.size,
        summary: nc.summary,
        requires: nc.requires,
        locked: false,
        started: null,
        completed: null,
        status: 'ghost',
        backlinks: []
      });
      structuralChange = true;
    } else if (nc.action === 'remove') {
      const idx = curriculum.nodes.findIndex(n => n.id === nc.id);
      if (idx !== -1) {
        curriculum.nodes.splice(idx, 1);
        structuralChange = true;
      }
    } else if (nc.action === 'update') {
      const target = curriculum.nodes.find(n => n.id === nc.id);
      if (target) {
        target.title = nc.title;
        target.cluster = nc.cluster;
        target.type = nc.type;
        target.size = nc.size;
        target.summary = nc.summary;
        target.requires = nc.requires;
        updateCount++;
      }
    }
  }

  // Version bump: minor for updates/swaps, major for structural changes
  const oldVersion = curriculum.version || '1.0.0';
  const parts = oldVersion.split('.').map(Number);
  if (structuralChange) {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (updateCount > 0) {
    parts[1] += 1;
    parts[2] = 0;
  }
  const newVersion = parts.join('.');
  curriculum.version = newVersion;
  curriculum.updated_at = new Date().toISOString();

  // Save curriculum.json
  fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));
  console.log(`\n💾 Saved curriculum.json version ${newVersion} with ${curriculum.nodes.length} nodes.`);

  // Append CHANGELOG.md
  const logEntry = `\n## v${newVersion} — ${getTodayStr()}\n- **Reason**: ${userReason}\n- **Changes**: Added/removed/updated nodes or milestones.\n`;
  fs.appendFileSync(changelogPath, logEntry, 'utf-8');
  console.log(`📝 Appended CHANGELOG.md.`);

  // Rebuild Graph
  console.log('🔄 Rebuilding static page indices...');
  try {
    execSync(`node "${buildScript}"`, { stdio: 'inherit' });
    console.log('✅ Rebuild completed successfully.');
  } catch (err) {
    console.error('Error rebuilding graph:', err.message);
  }
}

function applyIndividualChanges(curriculum, proposed, userReason) {
  const nodeChanges = proposed.node_changes || [];
  const milestoneUpdates = proposed.milestone_updates || [];
  
  const acceptedNodeChanges = [];
  const acceptedMilestoneUpdates = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let index = 0;

  function askNext() {
    if (index < milestoneUpdates.length) {
      const m = milestoneUpdates[index];
      rl.question(`🏆 Approve Milestone Update: [${m.id}] Status -> ${m.status}? (y/n): `, (ans) => {
        if (ans.trim().toLowerCase() === 'y') {
          acceptedMilestoneUpdates.push(m);
        }
        index++;
        askNext();
      });
    } else if (index - milestoneUpdates.length < nodeChanges.length) {
      const ncIdx = index - milestoneUpdates.length;
      const nc = nodeChanges[ncIdx];
      rl.question(`📦 Approve Node Change [${nc.action.toUpperCase()}] ${nc.id}? (y/n): `, (ans) => {
        if (ans.trim().toLowerCase() === 'y') {
          acceptedNodeChanges.push(nc);
        }
        index++;
        askNext();
      });
    } else {
      rl.close();
      if (acceptedNodeChanges.length === 0 && acceptedMilestoneUpdates.length === 0) {
        console.log('\n❌ No individual changes approved. Replan aborted.\n');
        process.exit(0);
      }
      applyAllChanges(curriculum, {
        milestone_updates: acceptedMilestoneUpdates,
        node_changes: acceptedNodeChanges
      }, userReason);
    }
  }

  askNext();
}

run();
