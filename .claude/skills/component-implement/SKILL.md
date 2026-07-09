---
name: component-implement
description: Use to build and ship a base component in @friday-sandbox/react from an approved issue — "implement issue #N", "build and ship the Button", "add a Tooltip", "take the component to a PR", branching from a component issue, or getting the gates or CI green. The execution half after component-blueprint. Keywords tailwind-variants, fri-class, stories-as-tests, react-aria.
---

# Component implement

## Purpose

Ship an approved component issue: branch → scaffold → fill → gates → PR → green CI, then hand the review round to `component-rebut`.

## Input

- An approved component issue `#N` the user named this session — its body carries `component-blueprint`'s design + implementation plan.

## Tasks

1. **Branch.** Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"`. Confirm the issue is OPEN, unclaimed (`gh issue view <n> --json assignees,author`), carries `component-blueprint`'s design + plan, and the user named it this session. `gh issue develop <n> --checkout` (branch starts `<n>-`, off the default branch, one concern). Stage only this change's files.
2. **Scaffold.** `pnpm gen component --args <name> <primitive> <category> <parts>` — `primitive` = `aria` (interactive) or `native` (display/layout, incl. non-interactive react-aria parts); `parts` = comma-separated PascalCase subparts or `""`. Emits the 5 surfaces + `index.ts` + `.changeset/<name>-component.md`; wires the 2 react barrels, styles `index.css`, docs `meta.json`; adds `<name>.namespace.ts` + a subpart stub per part for a compound.
3. **Swap the primitive.** Replace the scaffold placeholder with the real part — a react-aria-components part (`AriaButton`), a radix part (`scroll-area`), or a semantic element (`kbd`/`code`). Widen props to `ComponentPropsWithRef<typeof X>`. Compose className via `composeTailwindRenderProps` for a render-prop primitive. Add `"use client"` for a client primitive. Import the per-component subpath (`react-aria-components/<Part>`, `react-aria-components/composeRenderProps`) and add each to `optimizeDeps.include` in `.storybook/main.ts`.
4. **Fill the ladder, one value end to end** — class in `<name>.styles.ts` → rule in `<name>.css` → story cell → next value. Vocabulary: color `primary secondary accent info success warning danger`; `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`. Every value a distinct `fri-<name>-<value>`; set `defaultVariants`. Keep the flat `tv({ base, variants })` unless the component has real slots.
5. **Mirror `<name>.css` to `.styles.ts` 1:1** (`button.css`): base in `@layer components`; geometry from `--_<name>-n`; radius `calc(var(--fri-<archetype>-radius) * var(--_<name>-n) / <md-n>)` (`action` buttons, `field` inputs, `box` surfaces); one class per color/variant/size; `:where(.fri-<name>)` bakes the `md` default; states via `[data-hovered] [data-pressed] [data-disabled] [data-focus-visible]` + `transition-base focus-ring status-disabled`. `@apply` only — a non-utility property becomes a named `@utility` in `layers/utilities.css`.
6. **Stories = tests** (`button.stories.tsx`, Vitest in Chromium): full `argTypes`; the showcase trio only ([`.claude/rules/stories-docs-sync.md`](../../rules/stories-docs-sync.md)) — `Default`, plus `Variants` for a `variant` axis (every value, `Flex`/`Grid`; a color or shape axis joins that grid), plus `Sizes` for a `size` axis; no per-state or use-case story — use cases are the designer's, after ship. `play` on `Default` for an interactive base (`userEvent.tab()` → `toHaveFocus`), a presence/`getComputedStyle` assertion for a display base. Content from `@friday-sandbox/react/samples` (`Boxes`, `Lorem`); layout with `Flex`/`Grid`.
7. **Docs `<name>.mdx`** on the `.claude/rules/prose-style.md` spine, complete from the design: `<SourceLinks>`, Import, Usage, Purpose, When to use, When not to use, one `##` feature section per showcase story with the same name (`Variants`, `Sizes` — `lint:symmetry` checks the mirror), Props, Styling, Accessibility.
   - **Props** — one `| Prop | Type | Default | Description |` row per prop; one table per part for a compound (`### <Name> Props` for a callable root, then `### <Name>.<Part> Props` per part — `lint:symmetry` checks headings and columns).
   - **Styling** — every `fri-<name>-<value>` class as a row; a `### State selectors` `[data-*]` table for an interactive base.
   - Set the real `STORYBOOK_URL`; drop the `headless` prop when the part has no standalone page.
8. **Compound.** Callable-root (`link`/`grid`) — pass `parts`, auto-wired. Namespace-of-parts (`scroll-area`) — scaffold single, hand-write `.namespace.ts` + barrel blocks. Complex props → `<name>.types.ts` (`flex`).
9. **Changeset.** Keep the generated `<name>-component.md`. A non-generated behavior change → `pnpm changeset` once.
10. **PR.** Gates via the hooks. Title `type(scope): subject` ≤50, lowercase imperative; `Closes #<n>` in the body; fill the template.
11. **CI.** `gh pr checks <pr> --watch` to green; a failing check → fix by root cause, push, re-watch; "no checks configured" is not a failure. Hand the AI-review round to `component-rebut`.

## Rules

- Act only on an issue the user explicitly named this session — OPEN, unclaimed, yours. Never auto-match by title; never branch/push/PR without a per-artifact yes; never touch an artifact this session didn't create ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md), [`.claude/rules/no-guessing.md`](../../rules/no-guessing.md)).
- Build only the issue's spec + the generator template. A prop, variant, or axis not in the issue is a `component-blueprint` gap — loop back, never guess it here.
- Mirror 1:1 — no orphan class either side; every value a distinct class.
- Semantic Tailwind alias only (`gap-small`, `p-medium`); never a raw numeric (`gap-1`), a bare `gap-(--fri-*)`, or a hardcoded color.
- One changeset. Never `--no-verify`; never disable or loosen a gate — fix the root cause.
- Ship exactly the showcase trio the axes call for; do not author use cases, per-state stories, or extra doc sections. Do not hand-write boilerplate the generator emits — fix `turbo/generators/` instead.

## Acceptance criteria

- `<name>.styles.ts` and `<name>.css` mirror 1:1 — every class on both sides, no orphan, every value distinct. Do not run `pnpm lint:symmetry` by hand — the hooks own it.
- Scoped run passes: `pnpm --filter @friday-sandbox/react exec vitest run <name>`.
- The audit is clean: two parallel un-merged sub-agents on opus — **Standards** (token ladder, `:where()` default, ramp geometry, prose-style spine, `data-slot`) and **Spec** (right primitive, planned ladder, every demo, scope creep), grading Critical/Important/Minor; every Critical and Important fixed; builder ≠ verifier.
- Branch matches `^<n>-`; title parses ≤50; one changeset covers the change; gates green via the hooks + CI. Escalate to `component-blueprint` after the third thrashing fix ([`references/DIAGNOSING.md`](references/DIAGNOSING.md)).

## Output

| Issue  | Branch       | Component | Variants                     | Gates               | PR                      |
| ------ | ------------ | --------- | ---------------------------- | ------------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<name>`  | `<roles>×<variants>×<sizes>` | pass via hooks + CI | `#<pr>` (`Closes #<n>`) |
