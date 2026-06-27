# Pull Request

<!--
Conditional sections below carry the suffix "(when touched)". Remove any
conditional section that does not apply rather than filling it with "N/A".
Keeping only the relevant sections keeps the review surface short.

Conditional sections:
- New or changed component (when touched)
- ESLint config / TS config / styles (when touched)
- Tooling / CI (when touched)
-->

## Title format

`type(scope): subject`, conventional commits, strict. Subject 50 characters or fewer, lowercase first word, no trailing period.

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

## Architecture compliance

- [ ] DRY: no duplicated logic; reused shared helpers and constants across `packages/*`.
- [ ] Symmetric: files of the same kind, whether component, story, or config, share one skeleton.
- [ ] Typed and named clearly; no dead code; no source comments unless intent is non-obvious.
- [ ] No lint rule disabled, gate skipped, or guard bypassed to make gates pass.

## Release impact

- Semver bump: <!-- patch | minor | major | none -->

## New or changed component (when touched)

- [ ] Mirrored the `button` folder under `packages/react/src/components/<tier>/<name>/` so the file shape stays symmetric.
- [ ] Lowercase filename, named export, `Props` colocated; `"use client"` only when a client API is touched.
- [ ] Reachable through the package's single `.` export (`./src/index.ts`) by wiring the barrel chain `components/index.ts` → `<tier>/index.ts` → `<name>/index.ts`.
- [ ] Story `<name>.stories.tsx` covers `Default`, `Hovered`, `Focused`, `Disabled`, and every color variant including `danger`.
- [ ] Accessible by default: semantic markup, keyboard reachable, ARIA only where DOM cannot convey intent.
- [ ] Vitest browser tests via the Storybook addon and Playwright chromium pass for new behavior.

## ESLint config / TS config / styles (when touched)

- [ ] `@friday-sandbox/eslint-config` keeps all three subpath exports `./base`, `./next-js`, and `./react-internal` working in consumer workspaces.
- [ ] `@friday-sandbox/typescript-config` keeps `base.json`, `nextjs.json`, `react-library.json` consistent.
- [ ] `@friday-sandbox/styles` token or layer change is documented; visual regressions reviewed in Storybook.
- [ ] Consumers still pass `pnpm exec turbo typecheck lint` and `pnpm knip`.

## Tooling / CI (when touched)

- [ ] Workflows pass `actionlint` and `zizmor`.
- [ ] Required status checks in the `main` ruleset updated if a CI job was renamed, added, or removed.
