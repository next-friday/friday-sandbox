---
---

Add the `component-*` skill suite (`component-loop`, `component-design`, `component-build`, `component-ship`, `component-review`) that drives a base component from one goal through design, build, ship, and review, with `component-loop` sequencing the stations to a verifiable build contract before any authorized GitHub write. Make the `pnpm gen component` generator primitive-aware (`native` or `aria` scaffolds), and add a `pnpm lint:symmetry` check — wired into the pre-push and CI gates — that verifies the `variants.ts` ↔ `css` mirror for every base component. Tooling only; no published package changes.
