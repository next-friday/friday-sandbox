# Rule: no unprovable LLM-capability claims

In governance docs, specs, READMEs, PRs, issues, and any artifact, do not claim
what an AI/LLM _will_ do, for example "an assistant can generate a complete, valid
theme from the grammar alone." That is an unverifiable capability claim a
reviewer can rightly challenge: which model? proven how? what about
hallucination?

State the **engineering property of the system** instead: regularity,
determinism, tooling-friendliness:

- Bad: "AI/LLM predictability, an assistant can generate a complete, valid theme from the grammar alone."
- Good: "Machine predictability: token names follow a regular grammar so generators, tests, docs, and LLM-assisted contributors can infer the expected shape consistently."

The claim must be about the artifact's own structure (which is verifiable), not
about a model's output (which is not). Applies to design goals, value
propositions, and any marketing-adjacent wording. Pairs with the no-guessing
rule: assert only what you can verify.
