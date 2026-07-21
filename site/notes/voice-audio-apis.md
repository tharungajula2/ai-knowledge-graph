## ELI5
Half of India talks to their phones rather than types — voice is not a nice-to-have in your market, it's the door. The good news: a voice AI is mostly *plumbing you already understand*. Speech becomes text, text goes through everything you've built in this volume, text becomes speech. Two converters bolted onto your existing pipeline. This chapter is a landscape survey — vocabulary and architecture, no build — so that when a voice project lands on your desk, you speak its language on day one.

## The Real Explanation
**The classic pipeline, three stages.** **STT** (speech-to-text / ASR): audio in, transcript out — the famous open-weights family is Whisper (runs locally! privacy + zero per-call cost), with strong API options across providers; quality is measured in **WER** (word error rate — insertions+deletions+substitutions over word count; your Vol 01 Ch 12 metrics instinct applies: measure on *your* users' audio, not the vendor's demo reel). **LLM**: the transcript is just a user message — every skill in this volume applies verbatim (skeletons, tools, gateway). **TTS** (text-to-speech): text in, audio out — the axes are naturalness, voice choice/cloning (with its obvious deepfake ethics — voice cloning consent is non-negotiable), speed, and price per character/second.

**The two architectures — the real decision.** *Cascade* (STT → LLM → TTS): maximum control, each stage swappable and debuggable, your gateway sits in the middle untouched; cost = sum of stages; but latency stacks — each stage waits for the previous, and worse, naive cascades lose the *paralinguistics*: tone, hesitation, sarcasm flatten into bare text. *Native speech-to-speech* (realtime APIs — audio streams directly in and out of one multimodal model): dramatically lower latency, hears tone and handles interruptions naturally — but less controllable, pricier, and your careful middle-layer engineering has fewer insertion points. The industry runs both; the choice is your Ch 5 routing instinct again: control and cost vs latency and naturalness.

**The vocabulary that makes you sound (and be) fluent in meetings.** *Latency budget*: human conversation tolerates ~500–800ms of response gap before it feels broken — sum your stages against that number and streaming (Ch 8) becomes mandatory at every seam: stream STT partials, stream LLM tokens, stream TTS audio, overlap all three. *Endpointing / VAD* (voice activity detection): detecting that the speaker *finished* — too eager interrupts users mid-thought, too patient feels dead; this tiny detail makes or breaks perceived quality. *Barge-in*: user interrupts the bot mid-answer; the system must stop talking and listen — table stakes for real products. *Diarization*: who spoke when, in multi-speaker audio (meeting transcription's hard part). *Code-switching*: Hinglish/Telugu-English mid-sentence switching — the everyday reality of Indian speech and a known STT stress test; when you evaluate STT for this market, your golden set (Ch 16's habit) must be code-switched audio, full stop.

**Where this connects in your brain.** STT/TTS are just *tools* (Ch 7) an agent can call; a voice interface on your Domain-04 research agent is the cascade with your agent as the middle stage; and transcription is how meetings/calls become *documents* that flow into RAG (Domain 03). Voice isn't a separate world — it's an input/output skin over everything else you're building.

## Why It Matters
Where this appears in real systems and jobs: speech-to-text and text-to-speech landscape.

## Hands-On
Survey, not build (S-node): (1) run *one* real STT call — record a 30-second voice note on your phone *in natural Hinglish/Telugu-mixed speech*, run it through any STT (Whisper locally via a one-liner, or an API), and compute rough WER against your own honest transcript — write the number and the two worst errors in your note; (2) sketch the cascade architecture for a "voice FAQ bot for a bank" on paper — every stage, every seam where streaming applies, the VAD/barge-in points, and your estimated latency budget per stage against the 800ms ceiling; (3) write a five-line decision memo: cascade or native realtime for that bank bot, and why. The sketch + memo + WER number = the note.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. Draw the cascade from memory and state each stage's input, output, and quality metric.
2. Cascade vs native speech-to-speech: two decisive advantages each, and which product situations favor each.
3. Define VAD, barge-in, and diarization in one sentence each, and name the one that most shapes perceived quality.
4. Why is code-switching a first-class evaluation criterion in your market, and where must it show up?
5. Where do STT/TTS plug into your existing chapters — name three connection points.


---

## Wikilinks
[[streaming-responses]]
[[tool-calling]]
[[classical-ml-fundamentals]]
[[model-landscape]]

## Status log
- Started: 2026-07-21
- Finished: null