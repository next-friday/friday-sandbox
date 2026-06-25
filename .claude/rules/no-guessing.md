# Rule: no guessing, verify from real sources

Never state a guess as fact. Any claim about an external library, API, tool, or
runtime behavior, and any comparison table, must be backed by a real source
before it is written: official docs, source code, or a live fetch
(WebFetch / WebSearch / context7). Do not answer such questions from model memory.

- If the source has not been read yet, say so and go read it. Do not fill the gap with a guess.
- Every factual cell in a comparison must trace back to a source you actually consulted; cite the URL where it matters.
- For multi-library or high-stakes comparisons, fan out research and adversarially verify each claim, defaulting to "refuted" when no source supports it, rather than asserting from recall.

Guessing is a half-fix: fix it at the root by reading the source, the same way
code problems are fixed at their definition rather than patched downstream.
