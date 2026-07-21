## ELI5
You're blindfolded on a hilly landscape and you want to reach the lowest valley. You can't see — but you can *feel the slope under your feet*. So you take a small step downhill. Feel again. Step again. Thousands of steps later, you're in a valley. That's it. That's how every neural network on Earth is trained. The landscape is "how wrong the model is," the position is "the model's settings," and the feel-the-slope-step-downhill ritual is called **gradient descent**.

## The Real Explanation
Three words carry the whole field. Learn them cold.

**Weights.** A neural network is a giant formula full of adjustable knobs called weights (also "parameters"). A model like Llama-3-70B has 70 *billion* of these knobs. Before training, they're random — the model outputs garbage. "Learning" means: find good values for every knob. Nothing more mystical than that.

**Loss.** To improve, you need a single number that says *how wrong* the model currently is. Show the model an example where the right answer is known, compare its output to the truth, and compute the gap — that gap is the **loss**. Loss high = model bad. Loss near zero = model nails it. The entire goal of training: make the average loss across millions of examples as small as possible.

**Gradient descent.** For every one of the 70 billion knobs, calculus (specifically an algorithm called backpropagation) can answer one precise question: *"if I nudge this knob up a tiny bit, does the loss go up or down?"* That per-knob direction is the **gradient** — the slope under your feet. Training step: compute loss on a batch of examples → compute the gradient → nudge every knob a tiny step in the loss-lowering direction (the step size is the **learning rate**) → repeat, millions of times. There is no understanding injected anywhere. There is only: wrong → measure wrongness → nudge all knobs slightly less-wrong → repeat until the wrongness is astonishingly small.

The miracle worth sitting with: this dumb ritual, run at planetary scale on text, produces something that writes poetry. Intelligence-looking behavior condenses out of error-minimization the way a snowflake condenses out of cold air.

**One honest caveat.** The valley you reach depends on where you started and the terrain — networks find *a* good valley, not provably *the best* one. In practice, for huge models, the valleys are good enough that nobody cares.

## Why It Matters
Where this appears in real systems and jobs: weights, loss, gradient descent — pure intuition.

## Hands-On
Play "gradient descent by hand": pick a secret number between 0 and 100 (write it down — say 62). Now pretend you're the optimizer trying to guess it. Start at 50. Your "loss" is the distance to the secret. Your only feedback each round: does moving up or down reduce the distance? Take steps, halve your step size when you overshoot. Count how many steps to land within 1. You just experienced loss, gradient direction, learning rate, and overshooting — the whole vocabulary.

## What I Built / Proof
Artifacts: code links, screenshots, numbers.

## Prove It
1. What are weights, in one sentence a 12-year-old accepts?
2. What exactly does the loss number measure, and what is the goal of training stated purely in terms of loss?
3. Describe gradient descent using the blindfolded-hiker picture, then name the real term for "step size."
4. Why is it accurate to say "the model was never taught rules — rules condensed out of error correction"?
5. A model's loss stopped going down but its answers are still bad. Give one possible reason (hint: valleys).


---

## Wikilinks
[[map-of-ai]]
[[what-is-a-language-model]]
[[training-pipeline]]
[[classical-ml-fundamentals]]

## Status log
- Started: 2026-07-21
- Finished: null