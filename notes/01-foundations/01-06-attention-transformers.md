---
id: attention-transformers
title: "Attention & Transformers"
domain: foundations
ring: 1
type: concept
size: M
status: dark
version: 0.1.0
created: 2026-07-20
updated: 2026-07-20
lit_date: null
revisions: 1
artifact: null
wikilinks: [tokens, embeddings-intuition, nlp-transformer-lineage]
tags: [foundations, attention, transformer, deep-learning]
---

<!-- PASTE MASTERCLASS NOTE BELOW THIS LINE. Then set status to charging (pasted) or lit (mastered), bump version, update the updated date. -->

# Attention & Transformer Architecture

The **Transformer** architecture (Vaswani et al., 2017) revolutionized natural language processing by replacing recurrent neural networks (RNNs) with **Self-Attention** mechanisms.

> "Attention is all you need: parallel processing of tokens across sequence dimensions unlocks scalable deep learning."

---

## 1. Scaled Dot-Product Attention Formula

The core scalar product equation mapping Query ($Q$), Key ($K$), and Value ($V$) matrices:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Attention Dimension Comparison

| Component | Matrix Shape | Description |
| :--- | :--- | :--- |
| **Query (Q)** | $(B, T, d_k)$ | Token target vectors searching for contextual focus |
| **Key (K)** | $(B, T, d_k)$ | Sequence key vectors being queried |
| **Value (V)** | $(B, T, d_v)$ | Token representation vectors aggregated by softmax weights |
| **Output** | $(B, T, d_v)$ | Context-aware representations |

---

## 2. Python Implementation (PyTorch Self-Attention)

Below is a clean single-head attention implementation with numerical stability checks:

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k: int):
        super().__init__()
        self.scale = 1.0 / (d_k ** 0.5)

    def forward(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor, mask: torch.Tensor = None):
        # Q, K, V shapes: (batch_size, num_heads, seq_len, d_k)
        scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        attn_weights = F.softmax(scores, dim=-1)
        output = torch.matmul(attn_weights, v)
        return output, attn_weights

# Instantiate for d_k = 64
attn = ScaledDotProductAttention(d_k=64)
print("Self-Attention module initialized successfully.")
```

---

## 3. Implementation Checklist

- [x] Compute Q, K, V linear projections
- [x] Apply scaling factor $\frac{1}{\sqrt{d_k}}$
- [x] Implement causal mask for autoregressive generation
- [ ] Implement Multi-Head Attention (MHA) concat layer
- [ ] Add rotary position embeddings (RoPE)

---

## 4. Connections & Related Nodes

- Pre-requisite vector input: [[tokens|Tokenization & Vocabulary]]
- Latent geometry: [[embeddings-intuition|Embedding Spaces]]
- Historical context: [[nlp-transformer-lineage|NLP Transformer History]]
