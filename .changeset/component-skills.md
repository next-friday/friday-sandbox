---
---

Add the `component-*` skill suite (`component-blueprint`, `component-implement`, `component-rebut`) — an issue-driven flow that designs a base component and records it to a GitHub issue (`component-blueprint`), branches from that issue to build and ship it through the gates to a PR (`component-implement`), then triages the AI code-review round (`component-rebut`). Make the `pnpm gen component` generator primitive-aware (`native` or `aria` scaffolds), and add a `pnpm lint:symmetry` check — wired into the pre-push and CI gates — that verifies the `variants.ts` ↔ `css` mirror for every base component. Tooling only; no published package changes.
