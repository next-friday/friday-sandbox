# Pull Request

<!--
Conditional sections below carry the suffix "(when touched)". Remove any
conditional section that does not apply rather than filling it with "N/A".
Keeping only the relevant sections keeps the review surface short.

Conditional sections:
- New or Changed Component (when touched)
- ESLint Config / TS Config / Styles (when touched)
- Tooling / CI (when touched)
-->

## Title Format

`type(scope): subject` — conventional commits, strict. Subject 50 characters or fewer, lowercase first word, no trailing period.

- The title carries no `#N` reference. The squash merge auto-appends `(#<this-PR>)`; adding `(#N)` duplicates it on `main`.
- Issue closures go in the body, one `Closes #N` per line. `Closes #1, #2` closes only `#1`.
- Do not use `+` as shorthand. Use `and` or commas.
- Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `setup`, `style`, `test`.

Examples:

- `feat(react): add Tooltip component`
- `fix(button): onClick fires twice when disabled flips off`
- `ci(github): pin actions to commit sha`

---

Closes #

<!-- Multiple issues: one per line:
Closes #1
Closes #2
-->

## Summary

Two or three bullets describing what changed and why.

## Architecture Compliance

- [ ] DRY — no duplicated logic; reused shared helpers and constants across `packages/*`.
- [ ] Symmetric — files of the same kind (component, story, config) share one skeleton.
- [ ] Typed and named clearly; no dead code; no source comments unless intent is non-obvious.
- [ ] No lint rule disabled, gate skipped, or guard bypassed to make checks pass.

## Release Impact

- Semver bump: <!-- patch | minor | major | none -->

## New or Changed Component (when touched)

- [ ] Scaffolded with `pnpm --filter @friday-sandbox/react generate:component` so the file shape stays symmetric.
- [ ] Component at `packages/react/src/<name>.tsx` (lowercase); client-only code starts with `"use client"`.
- [ ] Exported via the package `exports` map (`./*` → `./src/*.tsx`) so consumers import from `@friday-sandbox/react/<name>`.
- [ ] Story colocated under `packages/react/src/` (e.g. `stories/<Name>.stories.ts`) covering the main visual and interactive states.
- [ ] Accessible by default — semantic markup, keyboard reachable, ARIA only where DOM cannot convey intent.
- [ ] Vitest browser tests (Storybook addon, Playwright chromium) pass for new behavior.

## ESLint Config / TS Config / Styles (when touched)

- [ ] `@friday-sandbox/eslint-config` keeps all three subpath exports (`./base`, `./next-js`, `./react-internal`) working in consumer workspaces.
- [ ] `@friday-sandbox/typescript-config` keeps `base.json`, `nextjs.json`, `react-library.json` consistent.
- [ ] `@friday-sandbox/styles` token or layer change is documented; visual regressions reviewed in Storybook.
- [ ] Consumers still pass `pnpm exec turbo check-types lint` and `pnpm knip`.

## Tooling / CI (when touched)

- [ ] Workflows pass `actionlint` and `zizmor`.
- [ ] Required status checks in the `main` ruleset updated if a CI job was renamed, added, or removed.
