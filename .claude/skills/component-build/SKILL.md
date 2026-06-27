---
name: component-build
description: Use when a base component in @friday-sandbox/react needs building, fixing, or completing — adding a new one ("add a Button", "create a Tooltip"), filling missing or asymmetric variants, styles, stories, or docs, or finishing a component left half-done. Keywords tailwind-variants, fri-class, stories-as-tests, react-aria.
---

# Component Build

The build station for `@friday-sandbox/react` base components. `pnpm gen component` scaffolds a generic `<div>` stub with empty variants plus a ready-made changeset; the real work is swapping in the primitive, filling the variant ladder, and mirroring it in `@friday-sandbox/styles` — proven against a fixed contract. Stop only when the contract holds.

## When to use

- A new base component, or an existing one with a leftover stub, empty/asymmetric variants, missing stories or styles, or work left half-done.
- Not this station:
  - Settle the primitive, variant ladder, or tokens first → `component-design`.
  - Branch, changeset, gates, PR → `component-ship`.
  - Bot-review comments on the PR → `component-review`.

## Steps

1. **Generate — never hand-create.** `pnpm gen component` prompts for the name (kebab or words), the **primitive kind** (`native` for display/layout, `aria` for interactive), and the Storybook category. It writes 7 files — the five surfaces, the component's `index.ts`, and `.changeset/<name>-component.md` (`@friday-sandbox/react` + `@friday-sandbox/styles`, both `minor`) — and wires the 3 react barrels, `packages/styles/src/components/bases/index.css`, and the docs `meta.json`, idempotently. The changeset is already written — do not add a second. `native` scaffolds a minimal `<div>`; `aria` scaffolds the interactive skeleton (`size` axis, ramp geometry, focus/disabled states, interaction + base-class stories). For a fix/complete the files already exist; read them first.
2. **Make it the real component.** A `native` scaffold is `<div data-slot="<name>">` with `variants: {}`; if the component is interactive, swap the `div` for its primitive (react-aria-components like `AriaButton` per `button.tsx`, or a radix part per `scroll-area`) and widen the props. An `aria` scaffold is already an interactive skeleton over a native `<button>` with a `size` axis — swap the `<button>` for the specific react-aria primitive and add the `color`/`variant` axes the component needs. Either way keep `data-slot="<name>"`, widen props to `ComponentPropsWithRef<typeof X>`, and for render-prop primitives compose className through `composeTailwindRenderProps` (`components/utils/`).
3. **Fill the ladder — one value end to end, not all-at-once.** Take each variant value through its surfaces before the next: its class in `<name>.variants.ts` → its rule in `<name>.css` → its story cell → confirm it renders, then the next value. Vertical slices keep `lint:symmetry` green per increment and catch a wrong token mapping on value #1 instead of copied across all seven. Reuse the repo vocabulary, do not invent: color roles `primary secondary accent info success warning danger`; visual `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`; boolean modifiers as needed. Every value → a distinct `fri-<name>-<value>` class; set `defaultVariants`.
4. **Mirror in `packages/styles/src/components/bases/<name>.css`**, following `button.css`:
   - `.fri-<name>` base in `@layer components`, geometry from a component-local ramp multiplier (`--_<name>-n`) so one number drives height, padding, radius.
   - one `fri-<name>-<color>` class per role, wiring the generated ladder into local slots (`--fri-<role>` plus its `-foreground`, `-hover`/`-pressed`, `-soft`/`-soft-hover`/`-soft-pressed`, `-surface`/`-surface-hover`/`-surface-pressed`, `-border`, `-outline-border`, `-tint-hover`/`-tint-pressed` steps — the full set is in `button.css`).
   - one `fri-<name>-<variant>` class mapping those slots onto background / foreground / border.
   - size classes set only `--_<name>-n` and `text-label-<size>`; bake the `md` default at zero specificity with `:where(.fri-<name>)`.
   - states via react-aria data attrs (`[data-hovered] [data-pressed] [data-disabled] [data-focus-visible]`) and repo utilities (`transition-base focus-ring status-disabled`).
   - mirror **1:1**: every variant value has its class here, none orphaned either side.
5. **Stories in `<name>.stories.tsx` ARE the tests** (Vitest in Chromium via Playwright, `storybook/test`). Follow `button.stories.tsx`: full `argTypes`; a showcase story per variant axis (every value, laid out with `Flex`) and per state — render-only visual coverage, no `play`. For interactive bases, add `play` on `Default` (interaction — `userEvent.tab()` → `toHaveFocus`, keyboard → a `fn()` handler) and `BaseClassDefault` (`getComputedStyle` — the base class renders usably with no modifiers); for display/layout bases (text, flex, grid, separator, spinner), keep render-only coverage and skip the behavior plays. Include a class-only / `PlainHtml` story (the `fri-` classes work on a plain element).
6. **Docs `<name>.mdx`** — the STYLE.md spine: Purpose, When to use, When not to use, Example, [Props + one demo per feature], Accessibility last. The generator appended `<name>` to the curated `components/meta.json` `pages`; order it sensibly.
7. **Compound component?** The generator wires ONE export name. For multiple parts (`Grid` + `GridItem`, `ScrollArea` + parts) add the extra `export {…}` / `export type {…}` blocks by hand to `bases/<name>/index.ts`, `bases/index.ts`, `components/index.ts`, and `src/index.ts`, mirroring the existing Grid / ScrollArea blocks. Complex props → `<name>.types.ts` (see `flex`); compound API → `<name>.namespace.ts` (see `scroll-area`).
8. **Self-check** the contract, then the **two-axis sub-agent audit** (verifier ≠ builder, see Verify), then **iterate** until it holds. Build and fix sub-agents return one of DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT — it is always OK to stop and escalate (bad work is worse than no work); never force the same model to retry unchanged. Never stop on a half-pass.

## Done — the contract

- [ ] The scaffold's placeholder element swapped for the real primitive where the component needs one (no leftover stub `<div>` / `<button>`), and the variants filled.
- [ ] Variant vocabulary reuses the repo set, every value a distinct `fri-<name>-<value>`, `defaultVariants` set.
- [ ] `<name>.css` mirrors `.variants.ts` 1:1 — verified by `pnpm lint:symmetry` — via the ladder + `:where()` default + ramp-multiplier pattern; no orphan class either side; no hardcoded color (use the `--fri-<role>` ladder).
- [ ] States wired via react-aria data attrs and repo utilities (`focus-ring`, `status-disabled`, `transition-base`).
- [ ] Stories cover every variant value and every state (showcase renders); interactive bases add `play` on `Default` (interaction) and `BaseClassDefault` (base-class proof), display/layout bases stay render-only; plus a class-only story; all pass.
- [ ] mdx on the STYLE.md spine; `meta.json` carries `<name>`.
- [ ] Compound exports / `.types.ts` / `.namespace.ts` added if needed; generator-owned single-name wiring not hand-broken.
- [ ] Exactly one changeset — the generated `<name>-component.md`, not a duplicate.

## Verify

- **Machine-check the mirror first:** run `pnpm lint:symmetry`. It verifies the `<name>.variants.ts` ↔ `<name>.css` 1:1 mirror (no orphan class either side, every value distinct) for every base component, deterministically. Fix every orphan it reports before the judgment pass.
- Self-check each box, surface by surface. Self-grading is unreliable, so check against the boxes, not your memory of having done it.
- Then dispatch the judgment to **two parallel sub-agents, kept un-merged** so one axis can't mask the other:
  - **Standards** — conventions no script checks: token-ladder only (no hardcoded color), repo vocabulary reuse, the `:where()` default, ramp-multiplier geometry, the STYLE.md mdx spine, `data-slot`. Skip anything tooling already enforces.
  - **Spec** — fidelity to the design and the Done contract: the right primitive, the exact planned variant ladder, every planned demo present, and scope-creep (anything in the diff that wasn't asked for).
    Harden the dispatch: never write "do not flag" or "at most Minor" (that pre-judges the auditor); treat the builder's report as unverified claims (a stated rationale never lowers a finding's severity); grade each finding Critical / Important (can't be trusted until fixed) / Minor. Fix every Critical and Important; re-audit if anything was found.
- Stories are the gate — let the hooks run them; do not run whole-repo gates by hand.
- A gate red? Diagnose the root cause before patching, and escalate to `component-design` after the third thrashing fix — see [`references/DIAGNOSING.md`](references/DIAGNOSING.md).

## Red flags — STOP

- Left the `<div>` stub or empty `variants: {}` → that is unfinished generator output, not a component.
- Added a second changeset → the generator already wrote `<name>-component.md`; duplicates break the release.
- Invented a token instead of the generated `--fri-*` ladder → use the ladder; never hardcode a color.
- A variant class without its css rule, or the reverse → orphan; the mirror is broken.
- Two sizes or colors share a class → forbidden; every value distinct.
- A compound component with only the generated single export wired → add the extra blocks by hand.
- A variant value or state with no story, or an interactive base missing `play` on `Default` (interaction) or `BaseClassDefault` (base-class proof) → coverage gap.
- Hand-edited a barrel for a non-compound, or `meta.json` / `index.ts` casually → the generator owns the single-name wiring.
- Hand-writing boilerplate the generator could emit → that's a template gap; fix `turbo/generators/`, don't free-gen it.

## What this encodes

- The react/styles split linked by `fri-<name>`, the generated `--fri-*` token ladder, and the `@layer theme, base, components, utilities` cascade (`packages/styles/index.css`). Reference: `button` + `button.css`.
- Generator and templates: `turbo/generators/` (`native` scaffolds a div + empty variants; `aria` scaffolds the interactive skeleton; both come with an auto-changeset). Existing patterns to match: `button` (aria, full ladder), `text` (typography), `flex` (layout, `.types.ts`), `grid` (layout), `scroll-area` (radix compound, `.namespace.ts`), `separator`, `spinner`.
- Prose: `STYLE.md`. Tests-are-stories: `packages/react/vitest.config.ts` with `storybook/test`.
- Template-first: the generator owns the symmetric scaffold; fill only judgment. Boilerplate you hand-write across components is a **template gap** — fix `turbo/generators/` so the next component gets it for free, never paper it over with free-gen. Determinism = symmetry + fewer tokens.
