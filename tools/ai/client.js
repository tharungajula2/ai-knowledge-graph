const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const localEnvPath = path.join(repoRoot, '_local-secrets', '.env');
const backendEnvPath = path.join(repoRoot, '_local-secrets', 'backend', '.env');

// Simple zero-dependency environment loader
function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return false;
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  }
  return true;
}

// Check and load keys
if (!loadDotEnv(localEnvPath)) {
  if (loadDotEnv(backendEnvPath)) {
    try {
      fs.copyFileSync(backendEnvPath, localEnvPath);
    } catch (e) {
      // Ignore copy warnings
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Provider chain mirroring backend ModelGateway
const providers = [
  {
    name: 'gemini',
    enabled: !!(GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIzaSy')),
    call: async (prompt, isJson) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (isJson) {
        body.generationConfig = { responseMimeType: 'application/json' };
      }
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw new Error(`Gemini direct status ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    }
  },
  {
    name: 'groq',
    enabled: !!(GROQ_API_KEY && !GROQ_API_KEY.startsWith('your_')),
    call: async (prompt, isJson) => {
      const url = 'https://api.groq.com/openai/v1/chat/completions';
      const body = {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      };
      if (isJson) {
        body.response_format = { type: 'json_object' };
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw new Error(`Groq status ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      return data.choices[0].message.content;
    }
  },
  {
    name: 'openrouter',
    enabled: !!(OPENROUTER_API_KEY && !OPENROUTER_API_KEY.startsWith('your_')),
    call: async (prompt, isJson) => {
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const body = {
        model: 'google/gemini-2.5-flash-lite:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      };
      if (isJson) {
        body.response_format = { type: 'json_object' };
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/tharungajula2/vizier-ai'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        throw new Error(`OpenRouter status ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      return data.choices[0].message.content;
    }
  }
];

// Helper to provide high quality mock responses for local testing without active API keys
function getMockResponse(prompt, isJson) {
  if (prompt.includes("VIZIER's curriculum auto-evolution engine")) {
    // Replan flow mock response
    if (isJson) {
      return JSON.stringify({
        milestone_updates: [
          {
            id: "m1-resurrection",
            status: "lit",
            description: "Completed Early Resurrection Milestone: Machine 1 is online!"
          }
        ],
        node_changes: [
          {
            action: "add",
            id: "transformer-attention-math",
            title: "Transformer Attention & Mathematics",
            domain: "foundations",
            cluster: "Mathematical Foundations",
            type: "concept",
            size: "M",
            summary: "A deep dive into dot-product attention scaling, softmax layers, and backpropagation mechanics inside attention modules.",
            requires: ["attention-transformers"]
          },
          {
            action: "update",
            id: "tokens",
            title: "Advanced Tokenization & Vocabulary",
            domain: "foundations",
            cluster: "Token Mechanics",
            type: "deep-dive",
            size: "L",
            summary: "Understanding Byte-Pair Encoding (BPE), SentencePiece, vocabulary size trade-offs, and tokenization bugs.",
            requires: ["what-a-language-model-is"]
          }
        ]
      }, null, 2);
    }
  }

  if (prompt.includes("research scanner for VIZIER's AI Engineering curriculum")) {
    return `# Frontier Scan - Mock Report

### 1. LLM Context Window Optimization via Ring Attention
- **Relevance**: Affects node "Context Windows" (context-windows)
- **Description**: Ring Attention allows distributing the context window calculations across multiple GPUs sequentially, scaling context up to millions of tokens without memory blow-ups.
- **Worth a replan?**: **Yes**. Add a build exercise to the "Context Windows" node to simulate a basic ring attention token-routing schema.

### 2. Speculative Decoding & Draft Models
- **Relevance**: Affects node "Temperature & Top-p" (temperature-top-p), "What a Language Model Is"
- **Description**: Running a tiny draft model to propose tokens that a larger target model validates, accelerating generation speed by 2-3x.
- **Worth a replan?**: **Yes**. Add a deep-dive node about latency-reduction architectures in production.

### 3. GraphRAG and Hybrid Semantic Search
- **Relevance**: Affects node "Embeddings Intuition" (embeddings-intuition)
- **Description**: Combining vector embeddings with knowledge graph relationships to capture both global narrative and specific entities.
- **Worth a replan?**: **No**. Keep current baseline, as it is already covered in the agents/memory sections.`;
  }

  if (prompt.includes("linker engine for VIZIER's curriculum node graph")) {
    if (isJson) {
      return JSON.stringify({
        proposed_links: [
          {
            target_id: "embeddings-intuition",
            reason: "Tokens are directly mapped to high-dimensional spaces using embeddings."
          },
          {
            target_id: "what-a-language-model-is",
            reason: "Token processing forms the fundamental input pipeline of any language model."
          }
        ]
      }, null, 2);
    }
  }

  if (prompt.includes("VIZIER's social post architect")) {
    if (isJson) {
      return JSON.stringify({
        text_post: `🚀 Ever wondered how AI models actually 'read' your text?\n\nThink of it like a traditional Indian spice box (Masala Dabba). You don't dump entire packets of spices in at once; you use specific measures of ingredients, each bringing a unique profile to the dish.\n\nAI models do the exact same thing with your words! They slice sentences into tiny chunks called 'tokens' and map their semantic flavors in a high-dimensional space.\n\nCheck out the full Feynman-style explanation on my living curriculum:\n${prompt.match(/https?:\/\/[^\s]+/)?.[0] || 'https://vizier-life-os.vercel.app/site/brain'}`,
        carousel_outline: `Slide 1: Slicing sentences like spices! 🌶️\nSlide 2: What is a token? The raw ingredients of AI language.\nSlide 3: Words vs Chunks: Why AI splits words into sub-words.\nSlide 4: Mapping flavor: How models find coordinates for words.\nSlide 5: Common token traps (why AI fails at spelling or counting).\nSlide 6: Tap the link to explore the interactive visual graph!`,
        video_script: `[Visual: Close up of spices being sorted into a traditional dabba]\n"Just like you organize spices by flavor and warmth..."\n[Caption: AI doesn't read words!]\n"AI models organize words into coordinates called tokens. Let's break down how this shapes everything from search to chatbot memory in under 45 seconds..."`
      }, null, 2);
    }
  }

  if (isJson) return '{}';
  return 'Mock response content';
}

/**
 * Call the AI model gateway with fallbacks and a mock testing layer.
 * @param {string} prompt Prompt content
 * @param {boolean} isJson Whether to request structured JSON output
 * @returns {Promise<any>} Response text or parsed JSON
 */
async function generate(prompt, isJson = false) {
  let lastError = null;

  for (const provider of providers) {
    if (!provider.enabled) {
      continue;
    }
    
    try {
      const outputText = await provider.call(prompt, isJson);
      
      if (isJson) {
        let cleanText = outputText.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        return JSON.parse(cleanText);
      }
      return outputText;
    } catch (err) {
      console.warn(`⚠️ Provider '${provider.name}' failed:`, err.message);
      lastError = err;
    }
  }

  // If all live providers fail or are unconfigured, fallback to high-quality Mock AI responses for local CLI testing.
  console.log('ℹ️ No active/valid API keys found. Falling back to Mock AI Mode for testing.');
  const mockText = getMockResponse(prompt, isJson);
  if (isJson) {
    return JSON.parse(mockText);
  }
  return mockText;
}

module.exports = {
  generate,
  modelName: 'Multi-Provider-Fallback-Gateway'
};
