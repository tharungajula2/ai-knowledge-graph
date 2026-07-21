# THE VIZIER TEXTBOOK — VOLUME 01: FOUNDATIONS

### Ring `foundations` · 24 nodes · From absolute zero → the floor everything else stands on

> **How to use this volume.** One chapter = one node in your brain. Read the chapter, do the Hands-On, answer the Prove It questions *from memory in your own words*, write your Feynman note — then and only then does the node go **lit**. Lit nodes are locked forever. Do not read Volume 02 material to "get ahead"; the rings unlock outward for a reason. Every chapter ends with the wikilinks your note should contain.

> **What "god mode" means for this domain.** After Volume 01 you can: explain how an LLM works end-to-end to a 12-year-old *and* to a senior engineer, hand-calculate what a prompt costs, read any Python AI codebase without fear, and live in the terminal and Git like it's home. That is the floor. Everything in Domains 02–10 assumes this floor exists.

---

# PART I — HOW AI WORKS
*13 chapters. Zero code required for most of them. This part rewires your intuition.*

---

## Chapter 1 — The Map of AI
**Node:** `map-of-ai` · concept · S

### The Feynman opener
Imagine a set of Russian nesting dolls. The biggest doll is **AI**: any machine doing something that looks smart. Open it and you find **Machine Learning**: machines that get smart by *studying examples* instead of following hand-written rules. Inside that, **Deep Learning**: machine learning done with huge layered networks loosely inspired by brains. Inside that, **Generative AI**: deep learning models that don't just *classify* things but *create* things — text, images, code. And the smallest, newest doll is **Agentic AI**: generative models that can *take actions* — call tools, browse, write files — in a loop, to pursue a goal.

### The real thing
The distinctions that actually matter to an engineer:

**Rules vs learning.** Classical AI (1950s–1990s flavor) is `if/else` at heroic scale: chess engines with hand-coded evaluation, expert systems with thousands of human-written rules. It breaks the moment the world presents a case nobody wrote a rule for. Machine Learning flips the arrow: instead of *rules + data → answers*, you feed the machine *data + answers → rules*. The machine derives the rules itself, as numbers.

**Why deep learning ate everything.** Pre-deep-learning ML required humans to design "features" — a human decided that for spam detection, the useful signals are "number of exclamation marks" and "mentions of money." Deep learning's superpower is that the network *learns its own features* from raw data. Feed it raw pixels or raw text; the early layers discover edges or word-parts, middle layers discover shapes or phrases, late layers discover faces or meaning. Nobody designs the ladder — it emerges from training.

**What makes a model "generative."** A classifier maps input → label (spam / not spam). A generative model learned the *distribution* of the data deeply enough to produce new samples from it. For language models: given text so far, produce a plausible next piece — repeated, this *writes*.

**What elevates a generative model to an "agent."** One thing: **the loop**. A chatbot is one pass: prompt in, text out, done. An agent takes the model's output, treats parts of it as *actions* (call this API, run this search), executes them, feeds the *results* back in, and asks the model again — until the goal is met. Model + tools + loop + goal = agent. You will spend all of Domain 05 inside that loop.

The nesting is strict: every agent uses GenAI, all serious GenAI is deep learning, all deep learning is ML, all ML is AI. The reverse directions are all false.

### Hands-On
Open your Vizier dashboard (you built the perfect artifact for this chapter). Hover the rings from `foundations` outward and narrate out loud where each domain sits in the nesting dolls: which rings are "just ML," where generation enters, where agency enters. Then draw the nested-circles diagram on paper, from memory, with one real product example living in each band (e.g., a thermostat rule, a spam filter, image recognition, ChatGPT, an autonomous coding agent).

### Prove It
1. What is the fundamental difference between classical rules-based AI and Machine Learning?
2. How does Deep Learning bypass manual feature engineering?
3. Define "next-token prediction" in the context of Generative AI.
4. What is the key characteristic that elevates a generative model to an "agent"?
5. Sketch the nested relationship of AI, ML, DL, GenAI, and Agents.

**Wikilinks for your note:** [[how-machines-learn]] · [[what-is-a-language-model]] · [[classical-ml-fundamentals]]

---

## Chapter 2 — How Machines Learn
**Node:** `how-machines-learn` · concept · S

### The Feynman opener
You're blindfolded on a hilly landscape and you want to reach the lowest valley. You can't see — but you can *feel the slope under your feet*. So you take a small step downhill. Feel again. Step again. Thousands of steps later, you're in a valley. That's it. That's how every neural network on Earth is trained. The landscape is "how wrong the model is," the position is "the model's settings," and the feel-the-slope-step-downhill ritual is called **gradient descent**.

### The real thing
Three words carry the whole field. Learn them cold.

**Weights.** A neural network is a giant formula full of adjustable knobs called weights (also "parameters"). A model like Llama-3-70B has 70 *billion* of these knobs. Before training, they're random — the model outputs garbage. "Learning" means: find good values for every knob. Nothing more mystical than that.

**Loss.** To improve, you need a single number that says *how wrong* the model currently is. Show the model an example where the right answer is known, compare its output to the truth, and compute the gap — that gap is the **loss**. Loss high = model bad. Loss near zero = model nails it. The entire goal of training: make the average loss across millions of examples as small as possible.

**Gradient descent.** For every one of the 70 billion knobs, calculus (specifically an algorithm called backpropagation) can answer one precise question: *"if I nudge this knob up a tiny bit, does the loss go up or down?"* That per-knob direction is the **gradient** — the slope under your feet. Training step: compute loss on a batch of examples → compute the gradient → nudge every knob a tiny step in the loss-lowering direction (the step size is the **learning rate**) → repeat, millions of times. There is no understanding injected anywhere. There is only: wrong → measure wrongness → nudge all knobs slightly less-wrong → repeat until the wrongness is astonishingly small.

The miracle worth sitting with: this dumb ritual, run at planetary scale on text, produces something that writes poetry. Intelligence-looking behavior condenses out of error-minimization the way a snowflake condenses out of cold air.

**One honest caveat.** The valley you reach depends on where you started and the terrain — networks find *a* good valley, not provably *the best* one. In practice, for huge models, the valleys are good enough that nobody cares.

### Hands-On
Play "gradient descent by hand": pick a secret number between 0 and 100 (write it down — say 62). Now pretend you're the optimizer trying to guess it. Start at 50. Your "loss" is the distance to the secret. Your only feedback each round: does moving up or down reduce the distance? Take steps, halve your step size when you overshoot. Count how many steps to land within 1. You just experienced loss, gradient direction, learning rate, and overshooting — the whole vocabulary.

### Prove It
1. What are weights, in one sentence a 12-year-old accepts?
2. What exactly does the loss number measure, and what is the goal of training stated purely in terms of loss?
3. Describe gradient descent using the blindfolded-hiker picture, then name the real term for "step size."
4. Why is it accurate to say "the model was never taught rules — rules condensed out of error correction"?
5. A model's loss stopped going down but its answers are still bad. Give one possible reason (hint: valleys).

**Wikilinks for your note:** [[map-of-ai]] · [[what-is-a-language-model]] · [[training-pipeline]] · [[classical-ml-fundamentals]]

---

## Chapter 3 — What a Language Model Is
**Node:** `what-is-a-language-model` · concept · S

### The Feynman opener
Your phone keyboard suggests the next word as you type. A language model is that — trained so hard, on so much text, with so many knobs, that "suggest the next word" became indistinguishable from "think in writing." That's the entire trick. There is no second trick.

### The real thing
**The objective.** A language model (LM) is a function: *given the text so far, output a probability for every possible next token.* Feed it "The capital of France is" and it outputs a distribution: "Paris" 97%, "a" 0.5%, "located" 0.4%... Training (Chapter 2's ritual) means: across trillions of words of human text, keep nudging the weights so the *actual* next word in real text gets higher probability. The loss is precisely "how surprised was the model by the true next word."

**Generation is prediction on repeat.** To *write*, the model predicts a next token, appends it to the text, and predicts again — a loop called autoregressive generation. Every essay, every code file, every answer Claude gives you: one token at a time, each conditioned on everything before it.

**Why is that enough for magic?** Here is the deep idea, the one worth a full Feynman note: *to predict the next word extremely well, you are forced to model the world that produced the words.* To predict the next line of a Python function, something inside the weights must track what the code does. To predict the last sentence of a murder mystery, something must track who had motive. To predict text about chemistry, something must compress a lot of chemistry. Prediction is the *objective*; understanding-shaped structure is the *means* the optimizer discovers, because it's the only way to keep loss low on hard text. The skill was never "knows words." It's "compressed the patterns of the world well enough to continue any document plausibly."

**What it is not.** An LM has no database of facts it looks up, no goals of its own, no notion of true/false — only "likely to appear next in text like this." This single sentence explains hallucination (Chapter 10), why prompts steer behavior (Domain 02), and why we bolt on retrieval (Domain 03) and tools (Domain 05). Hold onto it.

### Hands-On
Play LM-by-hand: take three openings — "Once upon a", "def calculate_", "The mitochondria is the" — and for each, write the 3 most probable continuations *with rough percentages*. Notice you can do this because you've also compressed the patterns of English, code, and biology-class memes. Then take one prompt and generate a full sentence one word at a time, always writing your top-probability word — feel the autoregressive loop from the inside.

### Prove It
1. Define a language model in one sentence, mentioning both input and output precisely.
2. What is autoregressive generation?
3. Explain why "just next-token prediction" is sufficient for apparent reasoning — the compression argument, in your own words.
4. Name two things an LM fundamentally does *not* have, and one downstream engineering practice each absence explains.
5. What exactly is the training loss for an LM measuring?

**Wikilinks for your note:** [[how-machines-learn]] · [[tokens]] · [[sampling-controls]] · [[hallucination]]

---

## Chapter 4 — Tokens
**Node:** `tokens` · concept · S

### The Feynman opener
Models don't read letters and don't read words. They read **tokens** — Lego bricks of text, somewhere between a letter and a word. "unbelievable" might be three bricks: `un` + `believ` + `able`. Every price you pay, every context limit you hit, and several famous model failures are all about these bricks.

### The real thing
**Why not letters or words?** Letters make sequences brutally long (every extra position costs compute). A dictionary of whole words explodes into millions of entries and dies on typos and new words. The compromise: **subword tokenization** (the common algorithm family is BPE — byte-pair encoding). Build a vocabulary of ~50k–200k frequent *chunks*: common words stay whole (`the`, ` house`), rare words split into pieces (`electro` + `magnet` + `ism`), and anything — any typo, any emoji — is representable from small pieces. Note the leading spaces: ` house` (with space) and `house` are different tokens.

**The rules of thumb you'll use weekly.** In English, 1 token ≈ 4 characters ≈ ¾ of a word; 1,000 tokens ≈ 750 words. Code tokenizes less efficiently (lots of symbols and whitespace); non-English languages can cost 2–4× more tokens for the same meaning — a real cost and latency issue for multilingual products.

**Why tokens explain famous failures.** "How many r's in strawberry?" — the model may see `straw` + `berry` as two opaque bricks; it never sees letters, so counting letters is like asking you how many atoms are in a chair. Same root cause for weakness at reversing strings, rhyming precisely, and arithmetic on long numbers (digits get chunked inconsistently: `1234` might be one token, `12345` might be `123` + `45`).

**Why an engineer cares.** (1) **Money** — APIs bill per token, in and out. (2) **Limits** — the context window (Chapter 8) is measured in tokens. (3) **Latency** — output is generated token-by-token, so long answers are slow answers. You'll turn all three into working code in the Build: Token & Cost Calculator chapter.

### Hands-On
Open a tokenizer playground in your browser (OpenAI's tokenizer page, or the `tiktoken` library later). Type and observe: your full name (rare names shatter into many pieces), "strawberry", a Python snippet, the same sentence in English vs Telugu/Hindi, a long number like 8675309. For each, write one line on *why* it split the way it did.

### Prove It
1. Why subword tokens instead of characters or whole words? Give one failure of each extreme.
2. State the English rules of thumb: tokens per word, tokens per 1,000 words.
3. Explain the strawberry failure mechanically, using the word "opaque."
4. Name the three engineering costs measured in tokens.
5. Why can serving a Hindi-language product cost multiples of the English version?

**Wikilinks for your note:** [[what-is-a-language-model]] · [[context-windows]] · [[build-token-cost-calculator]] · [[embeddings-intuition]]

---

## Chapter 5 — Embeddings Intuition
**Node:** `embeddings-intuition` · concept · S

### The Feynman opener
Imagine a magical map where every word, sentence, and document is a *pin*, and the rule of the map is: **things with similar meaning are pinned close together**. "King" is near "queen." "My laptop won't turn on" is near "computer fails to boot" — even though they share almost no words. An **embedding** is the coordinates of a pin on that map. Meaning, turned into numbers you can measure distance between.

### The real thing
**What it literally is.** An embedding model takes text in and outputs a vector — a list of, say, 768 or 1536 numbers. That vector is a point in a 768-dimensional space. You cannot picture 768 dimensions; nobody can. Picture the 2D map and trust that the math generalizes: the only operation that matters is *distance* (or its twin, similarity — usually **cosine similarity**, which scores direction-alignment between two vectors from -1 to 1, in practice ~0 to 1 for text).

**Where the geometry comes from.** Embedding models train on enormous piles of text pairs with a simple pressure: texts that appear in similar contexts, or that humans marked as related, must be pushed close; unrelated texts pushed apart. Squeeze billions of examples through that pressure and the space *organizes itself* — topic neighborhoods, tone directions, language bridges (the English and Spanish sentences for "I love dogs" land close). Nobody assigns coordinates. The geometry condenses out of training, exactly like the rules condensed in Chapter 2.

**The killer application: search by meaning.** Keyword search finds *strings*; embedding search finds *meanings*. Embed every document in your knowledge base once and store the vectors. At query time, embed the question, then find the **nearest neighbors** — the stored vectors closest to the query vector. Those documents are about the same thing, even with zero word overlap. This is semantic search, and it is the beating heart of RAG — the entirety of Domain 03 stands on this one idea. When you meet vector databases (Pinecone, Chroma, FAISS), they are simply purpose-built engines for "store millions of vectors, return nearest neighbors fast."

**Embeddings vs the LM.** Same family (transformers), different job. The LM outputs *the next token*. The embedding model outputs *a location*. You'll constantly use both in one system: embeddings to *find* the right knowledge, the LM to *write* with it.

### Hands-On
On paper, draw a 2D "meaning map" and pin these by gut feeling: "dog", "puppy", "wolf", "cat", "car", "truck", "The engine won't start", "My pet is sick". Now draw the query pin "vehicle repair" and circle its 2 nearest neighbors. You just ran a vector search by hand. Bonus: notice "wolf" sits near "dog" on the animal axis but far on a wildness axis — that's what having hundreds of dimensions buys: many axes of similarity at once.

### Prove It
1. What does an embedding model take in and put out, literally?
2. What is cosine similarity measuring, in one sentence?
3. Explain how the geometry arises during training — what's pushed together, what's pushed apart?
4. Why does semantic search beat keyword search for "my laptop won't turn on" vs a doc titled "computer fails to boot"?
5. What is a vector database, in one sentence, and which domain of your brain lives on it?

**Wikilinks for your note:** [[tokens]] · [[what-is-a-language-model]] · [[attention-transformers]]

---

## Chapter 6 — Attention & Transformers
**Node:** `attention-transformers` · concept · M

### The Feynman opener
Read this: "The trophy didn't fit in the suitcase because **it** was too big." What does "it" mean? You resolved that instantly because your brain let "it" *look back at* every earlier word and decide which ones matter — "trophy": very relevant; "suitcase": relevant; "the": ignore. **Attention** is exactly that, as math: every word gets to look at every other word and take a weighted vote on what matters for understanding it. The **Transformer** is the architecture built around doing this, in parallel, at massive scale. It's the "T" in GPT.

### The real thing
**The problem it solved.** Before 2017, language models (RNNs/LSTMs — full lineage in Chapter 13) read text strictly left-to-right, squeezing everything seen so far into one running memory. Two fatal flaws: long-range links faded (by word 500, word 3 is mush), and reading one-word-at-a-time can't be parallelized, so training crawled. The 2017 paper "Attention Is All You Need" threw away the sequential reading entirely.

**How attention works, one level down (the Q/K/V picture).** For each token, the model computes three vectors: a **Query** ("what am I looking for?"), a **Key** ("what do I contain, as an advertisement?"), and a **Value** ("what information do I actually carry?"). Every token's Query is scored against every other token's Key — high score means "you're relevant to me." The scores become weights (softmaxed to sum to 1), and each token's new representation is the weighted blend of everyone's Values. For "it": the Query "I'm a pronoun seeking my noun" matches hardest with the Key of "trophy," so "it"'s updated meaning is mostly trophy-flavored. This all-pairs matching is why attention cost grows with the *square* of sequence length — the reason long context is expensive (Chapter 8).

**Stacking makes understanding.** One attention pass = one round of "every word refines itself by consulting every other word." Transformers run many attention "heads" in parallel per layer (each head learns a different relationship-type: one tracks pronouns, one tracks syntax, one tracks rhyme...) and stack dozens of layers. Early layers resolve grammar; deep layers hold plot, logic, code semantics. Add feed-forward layers between attention layers (per-token processing), plus positional information so word order isn't lost, and that's the Transformer. Honestly — that's the whole machine behind the modern world.

**Why it took over everything.** Parallelism: all tokens process simultaneously, so training scales to GPU clusters and internet-sized data. Long-range: word 5000 attends to word 1 as easily as to word 4999. Generality: the same architecture, unchanged, mastered text, images (ViT), audio, protein folding. Scaling laws (bigger = predictably better) did the rest.

### Hands-On
Take the sentence "The bank raised interest rates because the economy was overheating." For the word "bank", play one attention head by hand: give every other word a relevance weight summing to 1 for the question "which sense of bank?" — notice "rates" and "interest" get the mass, which is *why* the model knows it's not a riverbank. Then do the same for "overheating." You just computed two rows of an attention matrix by intuition.

### Prove It
1. What two flaws of sequential (RNN) reading did attention fix, and which one unlocked massive scale?
2. Walk through Query, Key, Value using the trophy/suitcase sentence.
3. Why do multiple attention heads exist? Give two example relationship-types heads learn.
4. Why does attention cost grow quadratically with sequence length, and which everyday limit does that explain?
5. "The same architecture works for text, images, and proteins." What does that tell you about what the Transformer actually is?

**Wikilinks for your note:** [[embeddings-intuition]] · [[context-windows]] · [[nlp-transformer-lineage]] · [[training-pipeline]]

---

## Chapter 7 — Pretraining → Fine-tuning → RLHF
**Node:** `training-pipeline` · concept · S

### The Feynman opener
How do you make a helpful assistant? Same way you make a doctor. **Step 1:** twenty years of general education — read everything, absorb the world (pretraining). **Step 2:** med school — focused training on the specific job (fine-tuning). **Step 3:** residency with feedback — senior doctors watch your bedside manner and correct you until your behavior is right (RLHF). Every chatbot you've ever used went through exactly these three stages.

### The real thing
**Stage 1 — Pretraining.** Next-token prediction (Chapter 3) on trillions of tokens of internet text, books, and code. Months on thousands of GPUs; the tens-of-millions-of-dollars stage. Output: a **base model** — a magnificent autocomplete containing compressed world-knowledge, but with no manners and no sense of dialogue. Ask a base model "What is the capital of France?" and it may reply "What is the capital of Germany? What is the capital of Italy?" — because quiz lists are a likely continuation of quiz questions. Knowledge: vast. Assistant behavior: absent.

**Stage 2 — Supervised Fine-Tuning (SFT).** Take the base model and continue training — same gradient descent, tiny data: tens or hundreds of thousands of *hand-crafted examples* of ideal assistant behavior ("User asks X → a great assistant answers Y"). The model's weights shift from "continue any document" to "play the assistant character." Cheap relative to pretraining (days, not months). The same technique aimed at a domain (fine-tune on legal Q&A, on your company's tone) is how specialists are made — you'll do this with your own hands with QLoRA in a later domain.

**Stage 3 — RLHF (Reinforcement Learning from Human Feedback).** SFT teaches format; RLHF teaches *taste*. Generate multiple answers per prompt; humans rank them (A better than B). Train a separate **reward model** to predict those human preferences. Then optimize the chatbot against the reward model: nudge weights toward high-scoring behavior. This is the stage that produces "helpful, harmless, honest" — and also the stage blamed for sycophancy and over-refusal when the reward signal is imperfect. (A widely used simpler alternative, DPO, skips the separate reward model and optimizes on preference pairs directly — same goal, lighter machinery.)

**Why you must know the recipe as an engineer.** Because it tells you which tool fixes which problem: model lacks *knowledge*? → that's pretraining-scale (you won't fix it; use RAG instead). Model has wrong *format/style/domain voice*? → fine-tuning territory. Model has wrong *judgment/values*? → preference-training territory. Choosing among RAG vs fine-tuning vs prompting is a recurring interview question and a weekly real-job decision, and this three-stage map is the answer key.

### Hands-On
Write the three-stage biography of any assistant as a 6-line story for a 12-year-old ("First it read the whole library... then it did homework with a tutor... then audiences clapped or booed..."). Then answer for yourself: your company's model keeps answering in English when customers write in Telugu — which stage's problem is that, and what's the cheapest fix?

### Prove It
1. What does a base model excel at and hilariously fail at? Why does the failure make perfect sense?
2. What changes between pretraining and SFT: the algorithm, the data, or both? Be precise.
3. Explain the reward model's role in RLHF in two sentences.
4. Map each problem to the right stage-fix: missing recent knowledge / wrong tone / unsafe judgment.
5. Roughly compare the cost of the three stages, and say why that ordering matters for a startup.

**Wikilinks for your note:** [[what-is-a-language-model]] · [[how-machines-learn]] · [[hallucination]] · [[model-landscape]]

---

## Chapter 8 — Context Windows
**Node:** `context-windows` · concept · S

### The Feynman opener
An LLM is a genius with a whiteboard. Everything it can consider right now — your instructions, the conversation so far, documents you pasted, its own answer as it writes — must fit on that one whiteboard. The whiteboard is the **context window**, it's measured in tokens, and when it's full, something must be erased. The model has no other memory. None. Everything that looks like memory in AI products is engineering built *around* this whiteboard.

### The real thing
**What counts against it.** Everything: the system prompt, every user and assistant turn so far, retrieved documents, tool definitions and tool results, and the tokens of the answer being generated. Typical sizes today range from ~128k tokens to 1M+ on frontier models (~a long novel to several novels). Sounds huge; real agent sessions with tool results and codebases devour it shockingly fast.

**The statelessness bombshell.** The API is stateless: the model retains *nothing* between calls. A "conversation" is an illusion your application maintains by re-sending the entire history with every single message. Message 50 of a chat re-sends messages 1–49. Two consequences you'll engineer around forever: (1) cost grows with conversation length — you pay for the whole history every turn (mitigated by *prompt caching*, which discounts re-sent identical prefixes); (2) when history exceeds the window, your app must decide what to drop or summarize — the model won't decide for you, it will just error or lose the tail.

**Long context ≠ solved memory.** Two gotchas. **Quadratic cost** (Chapter 6): attention over 1M tokens is expensive and slow, so long-context calls cost real money and latency. **Lost in the middle:** models empirically recall the beginning and end of a huge context better than the middle — dumping 900k tokens of documents in does not mean 900k tokens of *attention-quality*. This is precisely why retrieval (Domain 03) exists: instead of the whole library on the whiteboard, fetch the 3 relevant pages. And it's why Domain 06 (memory) exists: summarize, store outside, re-inject selectively.

### Hands-On
Do context-window accounting for a real scenario, with Chapter 4's rules of thumb: a customer-support bot with a 2,000-token system prompt, a user on message 30 (average 80 tokens/message both sides), plus 3 retrieved docs of 1,500 tokens each. Total so far? How many more turns until you blow a 32k window? Now propose two engineering fixes and note which future domain each one belongs to (retrieval → 03, summarization/memory → 06).

### Prove It
1. List five things that all share the same context window.
2. "The model remembers our chat." Correct this sentence with the stateless truth, mechanically.
3. Why does turn 50 cost far more than turn 2, and what feature softens this?
4. What is "lost in the middle," and what does it imply about dump-everything prompting?
5. Explain in two sentences why context limits are the *reason* RAG and memory systems exist.

**Wikilinks for your note:** [[tokens]] · [[attention-transformers]] · [[hallucination]] · [[build-token-cost-calculator]]

---

## Chapter 9 — Temperature & Top-p
**Node:** `sampling-controls` · concept · S

### The Feynman opener
Chapter 3 said the model outputs *probabilities* for the next token — but a probability list isn't a word. Someone must *pick*. The picking rule is called sampling, and its two main dials are **temperature** and **top-p**. Same prompt, different dial settings → a lawyer or a poet. This is why the same question gives different answers on different runs.

### The real thing
**The choice at every single token.** Suppose after "The sky is" the model says: "blue" 60%, "clear" 20%, "dark" 10%, "falling" 2%, ...thousands more tiny ones. Options: always take the top token (**greedy**, temperature 0-ish) — maximally predictable, but repetitive and bland, and one early bad pick can lock in a bad path. Or sample randomly according to the probabilities — livelier, riskier.

**Temperature** reshapes the distribution before sampling. Low temperature (0–0.3) sharpens it — the rich get richer, "blue" climbs toward certainty; output becomes focused and deterministic-ish. High temperature (1.0–1.5) flattens it — underdogs like "falling" get real chances; output becomes creative, surprising, and increasingly unhinged. Mnemonic: cold = crystallized, hot = molecules bouncing everywhere.

**Top-p (nucleus sampling)** is a different philosophy: instead of reshaping, *cut the tail*. Sort tokens by probability, keep the smallest set whose probabilities sum to p (e.g., 0.9), sample only within that nucleus. Its virtue is adaptivity: when the model is confident (one token holds 95%), the nucleus is 1–2 tokens and output stays tight; when the model is genuinely uncertain (flat distribution), the nucleus widens and creativity is allowed *exactly where uncertainty is real*.

**Engineer's settings table (commit to memory):** extraction, classification, code, JSON output, math → temperature 0–0.2 (you want the most probable answer, and you want reruns to agree). General assistant → ~0.5–0.7. Brainstorming, fiction, naming → 0.8–1.2. Convention: tune temperature *or* top-p, not both aggressively. And the fine print that bites people: **temperature 0 still doesn't guarantee bit-identical outputs** across runs on real serving stacks (batching and floating-point nondeterminism) — "deterministic-ish," not notarized.

**Why this matters beyond style.** Reliability engineering (Domain on evaluation) begins here: flaky agent behavior is often just sampling variance; eval suites run at temperature 0 to reduce noise; and "run it 5 times and vote" (self-consistency) is a real technique built on *deliberate* variance.

### Hands-On
Get any chat interface with dial access (Google AI Studio's sliders are perfect). One prompt: "Describe the moon in one sentence." Run it 3× at temperature 0, then 3× at 1.2. Record all six outputs in your note. Then one JSON-extraction prompt at both settings — watch high temperature occasionally break your JSON. You now have personal evidence for the settings table.

### Prove It
1. What exactly does the sampler receive from the model, and what does it return?
2. Explain temperature's effect on the distribution using the rich-get-richer picture.
3. How does top-p adapt to model confidence in a way fixed temperature can't?
4. Fill in from memory: code extraction → T=? · brainstorm → T=? Why does rerun-agreement matter for the first?
5. Why can two temperature-0 runs still differ, and what does that mean for your test suites?

**Wikilinks for your note:** [[what-is-a-language-model]] · [[hallucination]] · [[tokens]]

---

## Chapter 10 — Hallucination
**Node:** `hallucination` · concept · S

### The Feynman opener
Ask a model for a citation and it may invent a paper — plausible authors, plausible journal, plausible year — that has never existed. It isn't lying; lying requires knowing the truth. The model is doing the *only thing it ever does*: producing the most plausible-sounding continuation. Usually plausible and true coincide. **Hallucination is what happens in the gap between them.**

### The real thing
**The mechanical cause — no lookup, only vibes.** Recall Chapter 3's closing sentence: an LM has no database and no truth-checker, only "likely next in text like this." Facts seen thousands of times in training (capital of France) are burned so deeply into the weights that the plausible continuation *is* the truth. Facts seen rarely — or your company's internals, or anything after training ended — have weak or no imprint, but the model *still must emit a next token*, and the objective rewards *fluent* over *silent*. So it interpolates: text shaped exactly like a real answer, unmoored from reality. Crucially, the generation process feels identical from the inside whether the fact is solid or invented — which is why confidence and correctness are uncorrelated, and why "it sounded so sure" is worth nothing.

**The high-risk zones — learn to smell them:** specific citations/URLs/case law; niche or private-domain facts; anything post-cutoff; precise numbers and dates; long chains of reasoning (one early confabulation poisons everything downstream); and questions with false premises ("Why did X buy Y?" — the model would rather explain a fictional acquisition than push back). Also: asking a model *why it* answered something — its introspection is itself a plausible-sounding generation.

**Grounding — the preview of half your brain.** You cannot train hallucination away entirely; the honest fix is architectural: **stop asking the weights to be the database.** Put the true facts *into the context window* and instruct: answer from these documents; if absent, say "not found." Grounded generation transforms the task from "recall from vibes" to "read and synthesize" — which models are dramatically better at. Retrieval-then-generate is exactly Domain 03 (RAG); tool-use ("search instead of guessing") is Domain 05; verifying and measuring groundedness is the evaluation domain; and citations-with-answers is why enterprises will hire you. One concept, four rings of your brain.

**The engineer's posture.** Never ship raw model output as fact in high-stakes flows. Ground it, cite it, verify it, or human-gate it. Your own agent-lab already contains a human-approval gate — you built the posture before you had the vocabulary.

### Hands-On
Induce hallucination deliberately (harmless and instructive): ask any model for "5 academic papers on [some hyper-specific niche], with authors and years," then try to find them — expect casualties. Then ask a false-premise question about a fictional event. Finally, re-ask the first question but paste in a real reference text and instruct "only from this document; say NOT FOUND otherwise." Write down the behavioral difference — that difference *is* the RAG value proposition, witnessed personally.

### Prove It
1. Explain mechanically why hallucination is not a bug but the objective working as designed.
2. Why is the model's confidence uncorrelated with correctness? Use "feels identical from the inside."
3. List five high-risk zones from memory.
4. Define grounding in one sentence, and name the domains of your brain it previews.
5. What does "stop asking the weights to be the database" mean for system design?

**Wikilinks for your note:** [[what-is-a-language-model]] · [[training-pipeline]] · [[context-windows]] · [[sampling-controls]]

---

## Chapter 11 — The Current Model Landscape
**Node:** `model-landscape` · frontier · S

> ⚠️ **This is a `frontier` node.** Per your graph's Rule 7, this chapter teaches the *permanent axes* for reading any model landscape — but the actual roster of models must come from a fresh frontier-scan **on the day you light this node**. Names and rankings printed today would be stale in a quarter. The axes below don't age; rosters do.

### The Feynman opener
"Which model is best?" is like "which vehicle is best?" — meaningless without axes. A truck, a scooter, and an F1 car are all "best." The landscape stops being a confusing zoo of names the moment you carry a fixed set of axes and pin every new name onto them.

### The real thing — the permanent axes
**Axis 1 — Open-weights vs closed API.** Closed (the frontier labs' flagships — Anthropic, OpenAI, Google): top capability, zero ops burden, per-token pricing, data leaves your walls, provider can deprecate. Open-weights (Meta's Llama line, Mistral, Alibaba's Qwen, DeepSeek, etc.): weights are files you can download — self-host, fine-tune freely, data stays home, but *you* own GPUs, serving, and upgrades. Note the honest term is open-*weights*, not open-source: you get the artifact, rarely the training data or full recipe. Enterprise conversations orbit this axis endlessly (compliance vs capability), which is why interviewers love it.

**Axis 2 — Frontier vs small.** Frontier models: maximum capability, maximum price and latency. Small models (single-digit billions of params) run on a laptop or phone, cost pennies, and — the key modern insight — a small model *fine-tuned for one narrow job* routinely beats a frontier generalist *at that job*. Production systems therefore **route**: cheap model for the easy 80%, frontier for the hard 20%. Model-tiering is a standard cost lever you'll pull in the production domain.

**Axis 3 — Modality & shape.** Text-only vs multimodal (vision/audio in, sometimes images out); embedding models vs generative (Chapter 5); "reasoning" variants that spend extra thinking-tokens to buy accuracy on hard problems — a live tradeoff (latency & cost vs depth) you now know how to evaluate.

**Axis 4 — How to *read* claimed rankings.** Benchmarks (exam-style scores) saturate and leak into training data; leaderboard arenas (humans blind-vote between model answers) measure preference, not truth; the only benchmark that finally matters is **your own eval set on your own task** — a drum the evaluation domain will beat loudly. Treat every launch-day claim as marketing until it survives your evals.

### Hands-On (do on light-day)
Run the frontier-scan: search the current top closed flagships, top open-weights families, and current pricing per million tokens for one frontier and one budget model. Build your personal landscape table with the four axes as columns and ~8 models as rows. Date-stamp it in the note — it is a snapshot, and per Rule 7 the *next* reader of this node might be you in a replan, re-running the scan.

### Prove It
1. Open-weights vs closed: give two decisive advantages each, and the compliance reason enterprises accept weaker models.
2. Why can a small fine-tuned model beat a frontier generalist? What production pattern does that enable?
3. What is a "reasoning" model spending, to buy what?
4. Why are public benchmarks weak evidence, and what is the only benchmark that matters?
5. Why is this node marked `frontier` — what rots, what doesn't?

**Wikilinks for your note:** [[training-pipeline]] · [[sampling-controls]] · [[hallucination]]

---

## Chapter 12 — Classical ML Fundamentals
**Node:** `classical-ml-fundamentals` · concept · M

### The Feynman opener
Before you're allowed to summon dragons, you learn why swords have two edges. Classical ML is where the field's permanent laws were discovered — and those laws (generalize, don't memorize; measure honestly; know your error types) apply *unchanged* to every LLM system you will ever ship. Interviewers probe here deliberately: it separates people who understand ML from people who've only used ChatGPT.

### The real thing
**Train/test split — the iron law.** A student who memorizes past exam papers aces those papers and fails the real exam. To know if a model *generalized* rather than memorized, you must evaluate it on data it never saw. So: split your data (classically 80/20), train on one part, measure on the held-out part, and *never let the test set influence any decision during development* (use a third split — validation — for tuning). The moment test data leaks into training, your accuracy number is fiction. This law reappears in LLM-land as "did the benchmark leak into pretraining?" — same disease, planetary scale.

**Overfitting & regularization.** Overfitting = the memorizing student: training error keeps falling while held-out error rises, because the model started fitting the *noise* of the training set. Cures share one spirit — constrain the model's freedom: penalize large weights (L1/L2 regularization), randomly disable neurons during training (dropout), stop training when validation error turns upward (early stopping), or simply get more data. The underfitting/overfitting seesaw (too simple ↔ too memorized) is the bias–variance tradeoff, and you'll feel it again the day you fine-tune with QLoRA and watch a model overfit 500 examples in three epochs.

**Precision, recall, F1 — because "accuracy" lies.** A fraud model that predicts "not fraud" always is 99.9% accurate and 100% useless. On imbalanced problems you must split the error types: **Precision** = of everything I flagged, how much was truly positive? (cost of false alarms). **Recall** = of all true positives out there, how many did I catch? (cost of misses). They trade off against each other via your decision threshold: cancer screening wants recall (a miss is a death; a false alarm is a follow-up test); spam filtering wants precision (a false alarm eats a real email). **F1** is their harmonic mean — a single balanced number, harsh on whichever is weaker. You will use precisely these words to evaluate RAG retrieval ("did we *recall* the relevant chunks?") and agent guardrails ("what's the *precision* of the injection detector?" — yes, the one in your own agent-lab).

**Confusion matrix — the 2×2 that generates everything.** Rows = truth, columns = prediction: True Positives, False Positives (false alarm), False Negatives (miss), True Negatives. Every metric above is arithmetic on these four cells (Precision = TP/(TP+FP), Recall = TP/(TP+FN)). Drawing this matrix from memory and deriving the metrics is a 90-second interview classic. Make it reflex.

### Hands-On
Take a concrete scenario: 1,000 emails, 50 are spam; your filter flags 60 emails, of which 40 are actually spam. Build the full confusion matrix (TP=40, FP=20, FN=10, TN=930), then compute accuracy, precision, recall, and F1 by hand. Then answer: your boss says "just maximize accuracy" — write two sentences on why that's a trap here. Finally, name which metric you'd prioritize for: airport weapons screening; a court's guilty verdict; your agent-lab's prompt-injection scanner.

### Prove It
1. State the iron law of the train/test split and the disease it prevents. What's its LLM-era echo?
2. Describe overfitting via the two error curves, and name three cures with their shared spirit.
3. Precision vs recall: define both from the confusion matrix cells, and give one domain that maximizes each.
4. Why is accuracy a lying metric on imbalanced data? Use the fraud example.
5. Draw the confusion matrix from memory and derive precision, recall, F1.

**Wikilinks for your note:** [[how-machines-learn]] · [[map-of-ai]] · [[nlp-transformer-lineage]]

---

## Chapter 13 — NLP Lineage to Transformers
**Node:** `nlp-transformer-lineage` · concept · M

### The Feynman opener
Every ancestor of the Transformer died of a specific disease, and the Transformer is the child that inherited every cure. Walk the family tree once — TF-IDF → Word2Vec → RNN/LSTM → attention — and the modern architecture stops being a miracle and becomes an *inevitability*. This chapter turns "I use LLMs" into "I know why LLMs are shaped like this."

### The real thing — four generations, four diseases, four cures
**Gen 1: Words as counts — TF-IDF (through the 2000s).** Represent a document by word-counts, weighted so that words frequent *in this document* but rare *across all documents* score highest (Term Frequency × Inverse Document Frequency — "the" scores ~0, "transformer" scores high in a doc about transformers). Powered a generation of search engines; still a respectable keyword-search baseline today (its descendant BM25 lives inside "hybrid search" in Domain 03 — this generation never fully died). **The disease: no meaning.** "Car" and "automobile" are as unrelated as "car" and "banana." Synonyms are strangers; word order is discarded entirely ("dog bites man" = "man bites dog").

**Gen 2: Words as vectors — Word2Vec (2013).** The breakthrough insight: *a word is known by the company it keeps*. Train a tiny network to predict a word from its neighbors across billions of sentences, and the learned vectors arrange themselves by meaning — "car" lands next to "automobile," and vector arithmetic famously half-works: king − man + woman ≈ queen. This is Chapter 5's embedding idea at its birth. **The disease: one frozen vector per word.** "Bank" gets a single vector, awkwardly averaging riverbank and finance. Context can't move the meaning.

**Gen 3: Reading in order — RNNs & LSTMs (2014–2017).** Recurrent networks read token-by-token, carrying a running memory vector; LSTMs added learned gates deciding what to keep and forget, stretching usable memory. Now context exists — "bank" after "fishing on the" reads differently — and this generation powered the first decent neural translation and Siri-era assistants. **The two diseases you met in Chapter 6:** distant information still faded (gradient signals decay across long sequences), and strict one-at-a-time reading made training unparallelizable — you cannot throw 10,000 GPUs at a model that must finish word 4 before touching word 5. Scale hit a wall.

**Gen 4: Everyone looks at everyone — Transformers (2017).** "Attention Is All You Need" deleted recurrence entirely: every token attends to every token directly (no decay across distance), all positions compute in parallel (the GPU wall falls), and every word's representation is rebuilt *from context* at every layer — so "bank" finally means the right thing in each sentence, solving Gen 2's disease too. Add the scaling laws (capability grows predictably with size + data + compute) and the path from 2017's translation model to today's frontier is just this architecture, scaled relentlessly.

**The lineage in one breath — say it out loud:** counts had no meaning → vectors had meaning but no context → recurrence had context but no reach and no parallelism → attention had reach, context, *and* parallelism, and parallelism is what let it eat the entire internet.

### Hands-On
Build the four-generation table in your note from memory: columns = *representation · superpower gained · fatal disease · what survives today*. (Survivals: TF-IDF→BM25 in hybrid search; Word2Vec→the embedding intuition; RNN→sequence thinking; Transformer→everything.) Then the classic probe: explain how each generation handles "bank" in "river bank" vs "bank account" — one sentence per generation. That single question tests the whole chapter.

### Prove It
1. What does TF-IDF score highly, and what's its fatal blindness? Which modern technique is its descendant?
2. State Word2Vec's core insight in one sentence, and its one-vector disease.
3. What did LSTMs fix about vanilla RNNs, and which two diseases remained?
4. Name the three simultaneous cures attention delivered, and circle the one that unlocked internet-scale training.
5. Recite the lineage-in-one-breath from memory.

**Wikilinks for your note:** [[attention-transformers]] · [[embeddings-intuition]] · [[classical-ml-fundamentals]] · [[map-of-ai]]

---

# PART II — THE ENGINEER'S FLOOR
*9 chapters, all build nodes. Part I rewired your intuition; Part II builds your hands. Every chapter here ends with an artifact that runs — that's the lighting condition.*

---

## Chapter 14 — Environments & Packages
**Node:** `python-environments` · build · S

### The Feynman opener
Project A needs library version 1.0; Project B needs version 2.0. Install both into one shared Python and they fight — the infamous "works on my machine" disease. A **virtual environment** gives every project its own private toolbox: its own Python, its own installed packages, zero crosstalk. Professionals never install project packages globally. Ever.

### The real thing
```bash
python3 -m venv .venv              # create the private toolbox (a folder named .venv)
source .venv/bin/activate          # step inside (Windows: .venv\Scripts\activate)
which python                       # verify: path now points INSIDE .venv
pip install requests               # installs land in the toolbox only
pip freeze > requirements.txt      # snapshot exact versions — the reproducibility contract
deactivate                         # step outside
```
The mental model: `activate` just edits your shell's PATH so `python` and `pip` resolve to the `.venv` copies. `requirements.txt` is how a teammate (or a server, or Docker in a later domain) rebuilds your exact toolbox: `pip install -r requirements.txt`. Two habits that mark professionals: `.venv/` goes in `.gitignore` (you commit the *recipe*, never the toolbox itself), and one project = one venv, created the minute the project folder is born. (Later you'll meet `uv` — a fast modern replacement doing the same jobs; the concepts transfer 1:1.)

### Hands-On (the artifact)
Create a folder `vizier-floor/`, and inside it a venv. Activate, prove isolation with `which python`, install `requests`, write `main.py` that imports requests and fetches any URL's status code, run it, freeze requirements. Then the real test: `deactivate`, delete `.venv` entirely, recreate it from `requirements.txt` alone, and run `main.py` again. If it runs, you've proven reproducibility — the entire point.

### Prove It
1. What disease do venvs cure? Describe the two-projects conflict precisely.
2. What does `activate` mechanically do to your shell?
3. Why commit `requirements.txt` but gitignore `.venv/`?
4. Write from memory: create, activate, install, freeze, deactivate.
5. Your script works locally, fails on the server with `ModuleNotFoundError`. First two things you check?

**Wikilinks for your note:** [[terminal-fluency]] · [[git-mastery]] · [[python-craft-professional]]

---

## Chapter 15 — Data Shapes
**Node:** `python-data-shapes` · build · S

### The Feynman opener
Every AI system is plumbing for one substance: **structured data flowing as dicts and JSON**. An API request? A dict. The response? Nested dicts. A RAG chunk, an agent's tool call, your curriculum.json? Dicts, dicts, dicts. Master four shapes — list, dict, function, JSON — and you can read 90% of AI code on sight.

### The real thing
**The two containers.** `list` = ordered sequence, addressed by position (`msgs[0]`, `msgs[-1]` for last). `dict` = labeled shelves, addressed by key (`msg["role"]`). Real AI data is *nested* — lists of dicts of lists — and fluency means walking nests without blinking:
```python
response = {
  "model": "claude-sonnet-4-6",
  "content": [{"type": "text", "text": "Hello!"}],
  "usage": {"input_tokens": 12, "output_tokens": 4}
}
text = response["content"][0]["text"]        # walk: dict → list → dict
cost_in = response["usage"]["input_tokens"]
safe = response.get("stop_reason", "unknown") # .get = no crash if key absent
```
**Functions as contracts.** `def cost(tokens: int, price_per_m: float = 3.0) -> float:` — read it as a contract: takes these shapes, returns that shape. Default values, keyword arguments (`cost(tokens=500)`), and returning dicts/tuples cover most real signatures you'll meet.

**JSON — the wire format.** JSON is just the universal *text* representation of dicts+lists, and every API speaks it. Two verbs, learn them cold: `json.dumps(obj)` (dict → string, to *send*) and `json.loads(s)` (string → dict, to *receive*). The classic beginner crash — `TypeError: string indices must be integers` — means you forgot `loads` and are indexing a raw string. The comprehension idiom rounds out fluency: `[m["text"] for m in messages if m["role"] == "user"]` — filter-and-extract in one line, everywhere in AI code.

### Hands-On (the artifact)
In `vizier-floor/`, write `shapes.py`: hand-build a fake API response like the above but with 3 content blocks; write functions `extract_all_text(response) -> list[str]`, `total_tokens(response) -> int`, and `to_json_file(response, path)` + `from_json_file(path)` using `dumps/loads` (via `json.dump`/`json.load` file variants). Round-trip it: build → save → load → extract → print. Bonus that pays forward: open your real `curriculum.json` from the brain repo and count nodes per domain with a comprehension.

### Prove It
1. When do you reach for a list vs a dict? One sentence each.
2. Read `data["items"][2]["meta"].get("tags", [])` out loud, naming each hop's type.
3. `dumps` vs `loads` — which direction is each, and which error tells you a `loads` is missing?
4. Write from memory a comprehension extracting all `"text"` values where `"type" == "text"`.
5. Why is "AI engineering is dict plumbing" only half a joke?

**Wikilinks for your note:** [[python-typing-pydantic]] · [[python-classes-modules]] · [[build-token-cost-calculator]]

---

## Chapter 16 — Classes & Modules
**Node:** `python-classes-modules` · build · S

### The Feynman opener
You don't need to *write* clever object-oriented code to be an AI engineer — but every codebase you'll open (LangChain, the OpenAI SDK, your own agent-lab) is built from classes and modules, so you must *read* them like plain English. A class is a blueprint bundling data with the functions that operate on it; a module is just a file you can import. That's 90% of the mystery.

### The real thing
```python
class Agent:
    def __init__(self, name: str, model: str):   # runs at creation
        self.name = name                          # self = THIS instance
        self.history: list[dict] = []
    def ask(self, prompt: str) -> str:
        self.history.append({"role": "user", "content": prompt})
        return f"[{self.name}] would call {self.model} here"

bot = Agent("vizier", "claude-sonnet-4-6")        # instantiate → __init__ fires
bot.ask("hello")                                   # method call; self is bot
```
Decoder ring for reading real code: `__init__` = constructor; `self` = "this particular object"; `bot.ask(...)` = function that lives on the object and can touch its data; `class ChatAgent(Agent):` = inheritance — ChatAgent *is an* Agent plus overrides (this is how LangChain's hundred retriever/LLM variants all share one interface — recognizing "subclass overriding a base method" unlocks that whole codebase style). You'll also constantly see `@dataclass` (auto-writes `__init__` for data-holding classes) and `@property` — recognize, don't memorize.

**Modules & imports.** Every `.py` file is a module; a folder with `__init__.py` is a package. `from agent import Agent` runs `agent.py` and pulls the name in. Two things that bite beginners: imports resolve relative to where you *run* from (hence running as `python -m package.module` from the project root), and the `if __name__ == "__main__":` block means "run this only when executed directly, not when imported" — it's how one file is both a library and a script.

### Hands-On (the artifact)
Split the Agent example across files: `agent.py` (the class), `memory.py` (a `Memory` class the agent holds — composition), and `main.py` importing both, creating two agents, and printing their separate histories (proving instance isolation). Then the reading rep that matters most: open your frozen `agent-lab/`, find one class, and write a 5-line plain-English summary: what data it holds (`__init__`), what it can do (methods), what it inherits.

### Prove It
1. What is `self`, and how do two instances of one class not collide?
2. What does `__init__` do and when does it run?
3. Read `class RetrievalAgent(BaseAgent):` aloud — what does it promise about RetrievalAgent's abilities?
4. What is the `if __name__ == "__main__":` idiom for?
5. Why does an AI engineer need to *read* classes fluently even if they rarely write them?

**Wikilinks for your note:** [[python-data-shapes]] · [[python-typing-pydantic]] · [[python-craft-professional]]

---

## Chapter 17 — Async/Await
**Node:** `python-async` · build · M

### The Feynman opener
A waiter takes table 1's order, walks it to the kitchen — and then just *stands there staring at the oven* until the food is done, while tables 2–8 starve. Absurd, yet that's synchronous code: when you call an LLM API (2–30 seconds!), sync code freezes the entire program to wait. **Async** is the sane waiter: fire the order, serve other tables, come back when the kitchen bell rings. AI apps are *made of* long waits — that's why every serious AI codebase is async.

### The real thing
**The one distinction that matters:** CPU-bound work (crunching numbers — your code is busy) vs **IO-bound** work (waiting on network/disk — your code is *idle*). LLM calls, embedding calls, DB queries, web fetches: all IO-bound. Async is the tool for IO-bound concurrency: one thread, many paused-mid-wait tasks, an **event loop** juggling them.
```python
import asyncio

async def call_llm(prompt: str) -> str:      # async def → a coroutine
    await asyncio.sleep(2)                    # stand-in for a real API call
    return f"answer to: {prompt}"

async def main():
    answers = await asyncio.gather(           # run all three CONCURRENTLY
        call_llm("q1"), call_llm("q2"), call_llm("q3")
    )                                         # 2 seconds total, not 6
    print(answers)

asyncio.run(main())
```
Decoder ring: `async def` marks a function pausable; `await` means "pause me here, event loop — go run someone else, resume me when this finishes"; `asyncio.gather` = "start all of these, give me all results"; `asyncio.run` starts the loop. The two laws: you can only `await` inside `async def`, and calling a coroutine without `await` does *nothing* (you get an unrun coroutine object — the #1 beginner bug, watch for the `RuntimeWarning: coroutine was never awaited`). The #2 bug: putting a *blocking* call (like `time.sleep` or the sync `requests` library) inside async code — it freezes the whole event loop, every table starves again; use async-native libraries (`httpx`, `aiohttp`) or `asyncio.to_thread` for stubborn sync code. Real-world guardrail: hitting an API with 500 concurrent calls triggers rate limits, so production code bounds concurrency with `asyncio.Semaphore` — fire in controlled batches.

**Why this chapter is load-bearing for your whole brain:** batch-embedding thousands of RAG chunks, multi-agent fan-out, streaming tokens to a UI, FastAPI endpoints (`async def` handlers), and your own agent-lab's async MCP bridge — one of its two "greatest hurdles" — are all this exact pattern. You are learning the hurdle's vocabulary now, calmly, before rebuilding it by hand.

### Hands-On (the artifact)
Write `race.py`: the fake `call_llm` above with a random 1–3s sleep. Run 5 calls sequentially (a plain loop with `await` one-by-one) and time it; then the same 5 via `gather` and time it. Print both durations. Then add a `Semaphore(2)` wrapper and watch 5 calls complete in ~2-call waves. Break it on purpose: call `call_llm("x")` without `await`, observe the warning, fix it. The timing printout is your artifact — it *proves* concurrency happened.

### Prove It
1. IO-bound vs CPU-bound — define both and say which one async helps and why.
2. Narrate exactly what happens at an `await`, mentioning the event loop.
3. Sequential loop vs `gather` over 5 two-second calls: total time each, and why?
4. Name the two classic async bugs and the symptom of each.
5. Why must AI applications specifically be async? Name three concrete cases from your future domains.

**Wikilinks for your note:** [[python-classes-modules]] · [[python-craft-professional]] · [[context-windows]]

---

## Chapter 18 — Types & Pydantic
**Node:** `python-typing-pydantic` · build · S

### The Feynman opener
Python happily lets you pass a string where a number belongs — and crashes at 2 a.m. in production instead of at noon in development. **Type hints** are labels that catch mistakes early; **Pydantic** turns those labels into an enforced border checkpoint: data that doesn't match the schema *does not enter*. And here's the twist that makes this chapter secretly huge: schemas are also how you make *LLMs* return reliable structured output. The schema mindset runs through your entire brain.

### The real thing
**Type hints** — documentation that tools can check: `def chunk(text: str, size: int = 500) -> list[str]:`. Modern syntax to recognize on sight: `list[dict]`, `str | None` (maybe-a-string), `Optional[str]` (older spelling of the same). Python doesn't enforce hints at runtime — editors and checkers (mypy/pyright) do — which is exactly why Pydantic exists for the borders of your system.

**Pydantic** — classes that *validate*:
```python
from pydantic import BaseModel, Field

class NodeNote(BaseModel):
    node_id: str
    status: str = "charging"                       # default
    xp: int = Field(ge=0)                          # constraint: ≥ 0
    wikilinks: list[str] = []

note = NodeNote(node_id="tokens", xp="150")        # "150" → coerced to int 150 ✅
bad  = NodeNote(node_id="tokens", xp="lots")       # ❌ ValidationError, loud & precise
```
Three superpowers: **validation** (garbage stops at the border with an error message pointing at the exact field), **coercion** (sensible conversions like `"150"` → `150` happen for you), and **serialization** (`note.model_dump()` → dict, `NodeNote.model_validate_json(s)` ← JSON string — the dict-plumbing of Chapter 15, now with a bouncer). The professional pattern: define Pydantic models at every *boundary* — API in, API out, file load, DB row — so the messy outside world is validated once, and everything inside works with guaranteed-clean objects.

**The AI payoff (why this tiny chapter echoes everywhere):** a Pydantic model auto-exports **JSON Schema** (`NodeNote.model_json_schema()`), and JSON Schema is the language of structured LLM output — "respond matching this schema" — and of tool definitions in agent frameworks. Define the shape once in Pydantic: validate your data with it, *and* hand it to the model as the contract, *and* validate what the model sends back. FastAPI is built on exactly this. Domain 02's structured-output nodes will feel like a reunion.

### Hands-On (the artifact)
Write `schema.py`: a `CurriculumNode` Pydantic model matching your real node format (id, title, type with allowed values, size, summary, status with default "ghost"). Load your actual `curriculum.json`, validate every node through the model, and print a count of valid nodes — if any fail, read the error and feel how precisely it points. Then print `CurriculumNode.model_json_schema()` and stare at it: that JSON is what you'll one day hand an LLM as an output contract.

### Prove It
1. What do type hints do and — importantly — *not* do at runtime?
2. Pydantic's three superpowers, one sentence each.
3. What is the "validate at the boundary" pattern and why does it beat validating everywhere?
4. How does one Pydantic model serve both your code and an LLM's output contract?
5. Read aloud: `def f(x: list[str | None]) -> dict[str, int]:`

**Wikilinks for your note:** [[python-data-shapes]] · [[python-classes-modules]] · [[python-craft-professional]]

---

## Chapter 19 — Git Mastery
**Node:** `git-mastery` · build · S

### The Feynman opener
Git is a time machine with parallel universes. Every **commit** is a snapshot you can return to forever; every **branch** is a parallel universe where you experiment without endangering the main timeline; **merge** brings a successful experiment home. You already *use* the ritual daily — this chapter is about finally *understanding* the machine, so nothing Git does ever scares you again.

### The real thing
**The three rooms.** Every file change moves through: **working directory** (your messy desk) → `git add` → **staging area** (the photo studio — *choose* what enters the next snapshot) → `git commit` → **repository** (the permanent album). Staging exists so one desk of changes can become several clean, single-purpose commits — the difference between a readable history and an archaeology dig. `git status` tells you which room everything is in; when lost, `status` first, always.

**The daily ten, understood not memorized:** `status` / `diff` (what changed) / `add -p` (stage by hunk — the pro move) / `commit -m` / `log --oneline --graph` (the timeline map) / `branch` / `switch -c feature-x` (new universe) / `merge` / `push` / `pull`. A branch is just a movable sticker pointing at a commit — creating one is free and instant, which is why the pro habit is: *never* experiment on `main`; every idea gets a branch; merge when proven, delete after.

**The undo table — memorize this and lose all fear:** unstage a file → `git restore --staged f`; discard uncommitted mess → `git restore f` (careful: gone-gone); fix the last commit's message or add a forgotten file → `git commit --amend`; *safely* undo a pushed commit → `git revert <sha>` (adds an anti-commit; history stays true); move your branch pointer back in time → `git reset` (fine locally, dangerous on shared history); "I deleted my work!!" → `git reflog`, the secret journal of everywhere HEAD has been — commits are almost never truly lost. Rule of thumb: `revert` for public history, `reset` for private.

**Merge conflicts, demystified.** A conflict is not an error — it's Git honestly saying "both universes edited the same lines; a human must choose." The `<<<<<<< ======= >>>>>>>` markers show both versions; you edit to the truth, `add`, `commit`. That's all a conflict has ever been.

**Why this is load-bearing:** your brain's own laws (lit nodes immutable, changelog-gated replans) are Git-shaped thinking; your milestone plan starts with tagging (`git tag pre-brain-simplification`) — Chapter 24's capstone will have you tagging releases of your own knowledge.

### Hands-On (the artifact)
In `vizier-floor/`, run the full drama: `git init`, commit `main.py`, branch `experiment`, change a line, commit, switch back to `main`, change the *same* line differently, commit, merge `experiment` → hit the conflict on purpose → resolve it, commit. Then time-travel: `log --oneline`, `revert` the merge, watch the file change back, then `reflog` and observe your whole journey recorded. Screenshot the graph — artifact done.

### Prove It
1. Name the three rooms and what `add` and `commit` each move between them.
2. What *is* a branch, physically, and why does that make branching free?
3. Revert vs reset — which for shared history and why?
4. A merge conflict appears. Narrate your exact steps, unafraid.
5. What is reflog, and what fear does it delete?

**Wikilinks for your note:** [[terminal-fluency]] · [[python-environments]] · [[capstone-foundations]]

---

## Chapter 20 — Terminal Fluency
**Node:** `terminal-fluency` · build · S

### The Feynman opener
The terminal is where all serious tools live — Git, pip, Docker, SSH, every deploy script. GUIs are menus at a restaurant; the terminal is the kitchen. The fear dissolves with exactly one realization: it's a *conversation*. You type a sentence (command + options + target), the computer answers. ~15 verbs cover 95% of an engineer's day.

### The real thing
**Moving & seeing:** `pwd` (where am I) · `ls -la` (what's here, including hidden dotfiles like `.venv` and `.git`) · `cd path` / `cd ..` / `cd ~` · `mkdir -p a/b/c` · `cp`, `mv` (also = rename), `rm -r` (no trash can — respect it) · `cat f` (print file) · `less f` (page through, `q` quits) · `head`/`tail` (`tail -f log` = watch a log live — you'll use this the rest of your life).

**The two superpowers.** *Pipes:* `|` sends one command's output into the next — `cat access.log | grep ERROR | wc -l` reads as a sentence: "print the log, keep only ERROR lines, count them." Small tools composed into pipelines *is* the Unix philosophy, and it's why the terminal beats any GUI for real work. *Redirection:* `>` writes output to a file (overwrite), `>>` appends — `python run.py > out.txt 2>&1` captures normal output *and* errors (stream 2) into one file, the exact incantation for capturing a crash to send or grep.

**`grep` deserves its own paragraph:** `grep -r "TODO" .` (search every file under here) · `-i` ignore case · `-n` show line numbers · `-v` invert (everything *except*). Finding where a function is defined in a strange codebase — `grep -rn "def build_index" .` — is daily bread.

**Quality of life that turns dread into home:** Tab completes paths (stop typing full names — this alone changes your life), ↑ replays history, `Ctrl+R` searches history, `Ctrl+C` kills the running thing, `history` shows everything, `man cmd` or `cmd --help` when stuck. Environment variables round it out: `export ANTHROPIC_API_KEY=...`, read by every SDK — you'll set these forever, and later domains put them in `.env` files.

### Hands-On (the artifact)
No mouse for this entire exercise. From home: create `terminal-dojo/logs/`, `cd` in, generate a fake log with `for i in $(seq 1 50); do echo "line $i $( [ $((i % 7)) -eq 0 ] && echo ERROR || echo OK )"; done > app.log`, then: count ERROR lines with a pipe, extract them to `errors.txt` with redirection, watch the file with `tail -f` in one command while appending a line from another, `grep -rn` for a string across the folder, and finish with `history | tail -20 > proof.txt`. That proof file is the artifact.

### Prove It
1. Translate to English: `cat app.log | grep -i error | wc -l`
2. Difference between `>`, `>>`, and `2>&1` — and the full incantation to capture a crash?
3. You're dropped into an unknown repo: which three commands orient you in 30 seconds?
4. What do Tab and Ctrl+R do, and why do they matter more than memorizing commands?
5. How does a program get your API key from the environment, and which command puts it there?

**Wikilinks for your note:** [[git-mastery]] · [[python-environments]] · [[python-craft-professional]]

---

## Chapter 21 — Build: Professional Python Craft
**Node:** `python-craft-professional` · build · M

### The Feynman opener
Everything so far taught you to write code that *runs*. This chapter is the jump to code a *team* can trust: organized as a package, typed, **tested**, measured, and installable. This is the single loudest difference between "I did a course" and "I've worked on real software" — and it's what makes every build node after this one land at professional grade by default.

### The real thing
**Layout — the standard skeleton** (recognize it in every serious repo):
```
tokentools/
├── pyproject.toml          # the project's ID card + dependencies + metadata
├── README.md
├── src/tokentools/
│   ├── __init__.py         # marks the package; exports the public API
│   ├── counter.py
│   └── pricing.py
└── tests/
    └── test_counter.py
```
`pyproject.toml` (name, version, dependencies, `requires-python`) is modern Python's single config file; with it, `pip install -e .` installs your package *editable* into your venv — imports work from anywhere, edits apply instantly. That one command is how professionals work on their own libraries.

**Testing with pytest — the heart of the chapter.** A test is a tiny function that *asserts* the truth:
```python
# tests/test_counter.py
from tokentools.counter import estimate_tokens
import pytest

def test_english_rule_of_thumb():
    assert estimate_tokens("hello world, how are you") == 6   # ~4 chars/token

def test_empty_string():
    assert estimate_tokens("") == 0

def test_rejects_non_string():
    with pytest.raises(TypeError):
        estimate_tokens(1234)
```
Run `pytest` — it auto-discovers `test_*.py` files and prints green dots or precise failures. Internalize the trio every test suite needs: the happy path, the *edge cases* (empty, huge, unicode), and the *expected failures* (`pytest.raises`). Then the habit that changes how you build: **the regression ritual** — every bug you ever fix gets a test that reproduces it first, so it can never sneak back. Tests aren't bureaucracy; they're the safety net that makes you *brave* — you'll refactor fearlessly in ten minutes because `pytest` will catch anything you break. (This mindset scales all the way up: model evals in your evaluation domain are "pytest for AI behavior.")

**Profiling — measure, never guess.** When code is slow, humans guess wrong about why. `python -m cProfile -s cumtime main.py` prints where the time actually went, sorted by cumulative time; `time.perf_counter()` around a suspect block is the quick manual version. The law: optimize *only* what profiling proves is hot.

**The craft checklist** that turns any script into a professional artifact: package layout ✓ · type hints on every public function ✓ (Chapter 18) · docstrings saying *what and why* ✓ · tests covering happy/edge/failure ✓ · `pip install -e .` works in a fresh venv ✓ · README with a 5-line usage example ✓.

### Hands-On (the artifact — verify with test passes)
Build the `tokentools` package exactly as laid out: `estimate_tokens(text)` (chars÷4 heuristic, TypeError on non-strings) and `estimate_cost(tokens, price_per_million)` in `pricing.py`, both typed and docstringed. Write ≥6 tests covering the trio for both functions. `pip install -e .` it, get all-green `pytest`, then profile a run that processes a 100k-word string 1,000 times and record the hot line in your note. All green = node lightable. (Keep this package — Chapter 22 imports it.)

### Prove It
1. What belongs in `pyproject.toml`, and what does `pip install -e .` do that plain scripts can't?
2. Name the test trio and write a `pytest.raises` block from memory.
3. What is the regression ritual, and what emotional change do tests buy an engineer?
4. Why "profile, never guess," and which command answers "where did the time go?"
5. Recite the craft checklist.

**Wikilinks for your note:** [[python-typing-pydantic]] · [[python-environments]] · [[build-token-cost-calculator]]

---

## Chapter 22 — Build: Token & Cost Calculator
**Node:** `build-token-cost-calculator` · build · M

### The Feynman opener
The graduation build of the Engineer's Floor: a real tool, built with every skill from Part II, that answers a question every AI company asks daily — **"what will this cost us?"** — using concepts from all of Part I. When a build makes intuition *executable*, the knowledge is yours. Plus: this tool genuinely impresses in interviews, because cost-consciousness is what separates hobbyists from engineers.

### The real thing — the spec
A CLI tool, built *on top of your Chapter 21 `tokentools` package*, that:
1. **Counts real tokens** — add the `tiktoken` library (a real BPE tokenizer — Chapter 4 made flesh) beside your chars÷4 heuristic, and report both, plus the heuristic's error %. Seeing where the rule of thumb bends (code! non-English!) is the lesson.
2. **Estimates conversation cost** — read a JSON file of messages (Chapter 15 shapes), model the *stateless resend*: turn N re-sends turns 1..N-1, so cost is quadratic-ish in conversation length (Chapter 8, now in numbers you computed).
3. **Compares models** — a small pricing table (frontier vs budget, input vs output prices per million; grab current prices the day you build — they rot, the *structure* doesn't). Output a comparison: "this conversation costs $X on model A, $Y on model B" — Chapter 11's routing logic, quantified.
4. **Validates at the boundary** — Pydantic models for the message file and the pricing table (Chapter 18); malformed input dies loudly at the border with a precise error.
5. **Ships professionally** — package layout, typed, ≥8 pytest tests including edge cases (empty conversation, unicode, absurd lengths) and `pytest.raises` on bad input (Chapter 21), README with usage (`python -m tokencost conversation.json --compare`), the whole build on a Git feature branch, merged when green, tagged `v0.1.0` (Chapter 19), inside a fresh venv with pinned requirements (Chapter 14).
6. **Writes the explainer** — per the node's own summary: a short piece in your note ("Why turn 40 of a chat costs 20× turn 2") written for a smart 12-year-old, with one real number from your own tool per claim.

### Hands-On
The spec *is* the hands-on. Suggested path: branch → Pydantic schemas → counting (heuristic, then tiktoken) → cost math for a single message → the resend loop → model comparison table → CLI wrapper (`argparse` is fine) → tests green → merge, tag → explainer. Est. 1–2 days honest work. When done, run it on a real exported conversation of yours and put the actual dollar figure in the note — that number is the trophy.

### Prove It
1. Where does the chars÷4 heuristic err worst, and why (mechanically, from BPE)?
2. Why is total conversation cost roughly quadratic in turns? Show the resend arithmetic for 4 turns.
3. Your tool says the budget model is 20× cheaper — give the routing argument for when you still pay for frontier.
4. Which boundaries did Pydantic guard in your build, and what dies loudly at each?
5. Point to the test in your suite you're proudest of and say what regression it forbids forever.

**Wikilinks for your note:** [[tokens]] · [[context-windows]] · [[model-landscape]] · [[python-craft-professional]]

---

# PART III — CONSOLIDATION
*2 chapters. Knowledge isn't yours until it survives compression and teaching.*

---

## Chapter 23 — Synthesis: The Foundations Map
**Node:** `synthesis-foundations` · synthesis · S

### The Feynman opener
The Feynman test, final form: explain "how an LLM works," end to end, to a 12-year-old — no jargon unearned, no hand-waving where it counts, under five minutes. Chapters 1–13 gave you thirteen puzzle pieces; this chapter is assembling them into **one picture you can draw on a napkin** — because in interviews, on LinkedIn, and to yourself at 2 a.m., the napkin version is the one that matters.

### The real thing — the through-line (one paragraph, learn its spine, then say it your way)
Text is chopped into **tokens** [4]. Each becomes a vector, and through stacked layers of **attention** — every token consulting every other token about what matters [6] — the model builds a rich in-context understanding, the mature form of the **embedding** idea, meaning-as-geometry [5]. The whole machine is billions of **weights** tuned by **gradient descent**: guess, measure the **loss**, nudge everything slightly less wrong, repeat at internet scale [2] — first in **pretraining** (predict the next token across the whole internet [3, 7]), then shaped by **fine-tuning** and **RLHF** into an assistant [7]. At runtime everything must fit the **context window**, the whiteboard that is the model's only memory [8]; the model emits probabilities and a **sampler** — temperature, top-p — picks each next token [9]. It optimizes *plausible*, not *true*, so where knowledge is thin it **hallucinates**, which is why we ground it with retrieval and tools [10]. Which model to run is a landscape question — open vs closed, frontier vs small, routed by cost [11]. And the whole edifice stands on classical ML's laws — generalization, honest evaluation, precision/recall [12] — at the end of a lineage that traded counts for meaning, meaning for context, context for parallel attention [13].

### Hands-On (the artifact — this IS the node)
Three renditions, escalating compression: **(a)** The 12-year-old script, written out, ≤600 words, every technical term introduced with a picture (whiteboard, bricks, blindfolded hiker...). **(b)** The napkin: one hand-drawn diagram — tokens → embeddings → attention stack → probabilities → sampler → text, with training as an arrow from above and the context window as a box around runtime. Photograph it into the note. **(c)** The 60-second version, spoken aloud to a phone recorder, jargon-free. If a real 12-year-old (or a patient non-technical friend) is available, deliver (a) live and record the questions they ask — their confusion is your map of what to re-study. Any chapter you couldn't compress: reopen it before lighting this node.

### Prove It
1. Deliver the 60-second version cold, right now.
2. Which chapter was hardest to compress, and what does that tell you?
3. A 12-year-old asks: "but where does it *keep* what it knows?" Answer in two sentences (weights vs context — the two memories).
4. A senior engineer asks the same question. Answer again, precisely, in two sentences.
5. Draw the napkin from memory.

**Wikilinks for your note:** every Part I node — this note is the hub they all link back to.

---

## Chapter 24 — 🏁 Capstone: Foundations
**Node:** `capstone-foundations` · capstone · M

### The Feynman opener
A capstone isn't a bigger exercise — it's a **public checkpoint**: package what you know into artifacts strangers can see, then formally decide how the journey continues. Ring 1 closes here. Per your graph's law, once lit, all of this is immutable — so make it worth locking.

### The real thing — three deliverables

**1. The mega-note.** The hub-note of Domain 01 inside your brain: the through-line paragraph (your wording, not mine), the napkin photo, links to all 24 node notes, your Chapter 11 landscape table (date-stamped), and a short honest reflection: hardest node, biggest surprise, one thing you'd tell day-zero-you. This becomes the template every future domain capstone follows.

**2. The public carousel — "How AI really works."** Turn the synthesis into a LinkedIn carousel (~8–10 slides): the napkin diagram redrawn cleanly, one big idea per slide (bricks/tokens → hiker/gradient descent → everyone-looks-at-everyone/attention → whiteboard/context → plausible-not-true/hallucination...), last slide = your journey frame ("Node 24 of 228 · Universe 01 · the map is public"). This is **M4's halfway-story muscle** getting its first rep, and — remember the 45-day mission — a public artifact that *shows* understanding instead of claiming it. Post it. The fear you feel pressing "post" is the capstone's real final boss.

**3. The replan checkpoint.** The graph is living; this is its formal heartbeat. Review Domain 02's ghost nodes against what you now know. Three allowed verdicts, each written into the changelog with a reason (Rule 6): *proceed* (plan holds), *amend* (add/resize/swap specific ghost nodes — e.g., something you hit in the builds deserves its own node), or *deepen* (a Domain 01 node revealed a gap big enough to spawn a follow-up). Commit the verdict, tag the repo `domain-01-lit`. Never replan from restlessness — but never skip the checkpoint either; the discipline of *written reasons* is what keeps the brain honest for 228 nodes.

### Hands-On
Assemble deliverable 1 → design and post deliverable 2 → run deliverable 3's review and commit the verdict. Then light the node, watch Ring 1 glow complete on the dashboard, and screenshot it — first ring of ten. That screenshot belongs in the mega-note too.

### Prove It
1. All five Prove-It questions from Chapter 1, answered again from memory — feel the difference 24 nodes made.
2. The 60-second synthesis, delivered to camera for the carousel's companion post.
3. One concrete amendment you considered for Domain 02, and the written reason for your verdict either way.
4. Why does the capstone demand a *public* artifact? Answer with reference to your own mission.
5. What is now immutable, and why is that a feature?

**Wikilinks for your note:** [[synthesis-foundations]] · [[model-landscape]] · [[git-mastery]] · every Domain 01 node.

---

# CLOSING — WHAT YOU NOW STAND ON

Ring 1 lit means: you can explain the machine (Part I), you can build with professional hands (Part II), and you've compressed it, taught it, and shipped it publicly (Part III). Domain 02 — Prompting & LLM APIs — assumes every word of this volume and starts immediately with `first-api-call`, where the whiteboard, the tokens, the sampler, and the dollar signs all become a live object in your terminal.

The past is locked. The future evolves. **Volume 02 awaits.**
