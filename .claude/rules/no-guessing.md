# Rule: no guessing — verify from real sources

Never state a guess as fact. Any claim about an external library, API, tool, or
runtime behavior, and any comparison table, must be backed by a real source
before it is written: official docs, source code, or a live fetch
(WebFetch / WebSearch / context7). Do not answer such questions from model memory.

**Official docs first — before answering or acting.** The first move on any such
question is to open the official documentation, not to draft from recall. Sources
rank in order: (1) official docs or the published spec, (2) the tool's own source
code, (3) a live fetch (WebFetch / WebSearch / context7). Model memory is never a
source and never the first step; recall only hints which doc to open.

- If the source has not been read yet, say so and go read it. Do not fill the gap with a guess.
- Every factual cell in a comparison must trace back to a source you actually consulted; cite the URL where it matters.
- For multi-library or high-stakes comparisons, fan out research and adversarially verify each claim, defaulting to "refuted" when no source supports it, rather than asserting from recall.

**Discover the repo, don't recall it.** The repo is the source of truth for its
own shape. Before acting on where a file lives, whether it is generated or
authored, published or private, what a token is named, or which CI check is
required, grep and read the real tree, run `pnpm gen` and read its output, or
read the gate's own output — never act from "how repos usually work." An
existing helper, component, or token is found by searching for it before
creating one; the generator then enforces the canonical shape. This is
no-guessing applied to the codebase itself.

Guessing is a half-fix: fix it at the root by reading the source, the same way
code problems are fixed at their definition rather than patched downstream.

Pairs with libs-first (read the tool's docs before assuming it can't do the
job) and docs-follow-code (the tree, not memory, is what docs must match).
