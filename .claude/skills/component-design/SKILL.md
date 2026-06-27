---
name: component-design
description: Use before building a base component in @friday-sandbox/react when its shape is not settled — which primitive to wrap (react-aria-components, radix-ui, native), which color/variant/size ladder it needs, which tokens and states. Triggers "design a Tooltip", "what variants should X have", "plan this component". Not for docs, config, tooling, or other non-component design or planning.
---

# Component design

The design station for `@friday-sandbox/react` base components: choose the primitive, the variant ladder, and the token mapping against the repo's existing vocabulary before any build, so `component-build` has a fixed target. A precise design is the leverage; a vague one propagates into every surface. Grill one decision at a time, each with a recommended answer; the design is done when an implementer could build it without asking another question.

## When to use

- Before `component-build`, for a new or reworked component whose primitive, variant ladder, or token mapping is not decided.
- Symptoms: unsure which primitive to wrap, how many roles/sizes, which states, or what the doc demos are.
- Not this station:
  - The shape is already clear → go straight to `component-build`.
  - gh issue, branch, PR → `component-ship`. Record a design to an issue only with explicit per-artifact authorization (shared tracker).

## Steps

1. **Premise.** Should it exist here? Is there a `bases/` component to extend instead of duplicating? (The menu: `button` interactive/aria, `text` typography, `flex`/`grid` layout, `scroll-area` radix compound, `separator`, `spinner`.) Name the real problem first.
   - **Then design it twice before converging** — if the shape isn't obvious, diverge on the API and visual structure (see [`references/DESIGN-IT-TWICE.md`](references/DESIGN-IT-TWICE.md)), pick or hybridize a winner, and carry it into the steps below. Skip when grilling already settled the shape in one pass.
2. **Pick the primitive** — what `<name>.tsx` wraps. react-aria-components for interactive/a11y (button wraps `AriaButton`), a radix part for compound widgets (scroll-area), or native HTML for layout/text (flex, text). This is the generator's `primitive` prompt: `aria` for interactive (scaffolds the size and state skeleton), `native` for display/layout. The primitive gates the props, so choose it first.
3. **Resolve the variant ladder**, reusing the repo vocabulary: color roles `primary secondary accent info success warning danger`; visual `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`; boolean modifiers. Add a new axis only with a stated reason. Every value distinct, each with its `fri-<name>-<value>` class.
4. **Map tokens and states.** Each color → the generated `--fri-<role>` ladder slots (`-foreground`, `-hover`/`-pressed`, `-soft*`, `-surface*`, `-border`, `-outline-border`, `-tint-*` — the full set is in `button.css`); never hardcode a color. Size → the ramp-multiplier pattern. States: which react-aria data attrs apply (`data-hovered`, `data-pressed`, `data-disabled`, `data-focus-visible`, plus component-specific). Reference `button.css`.
5. **Plan the surfaces and demos.** The five surfaces, and the stories — one per variant axis (laid out with `Flex`), one per state, plus `BaseClassDefault` and a class-only proof — so `component-build`'s contract is pre-drawn.
6. **Hand off.** Output the design: primitive + ladder + token/state map + surface/demo plan, plus a **Global Constraints** block — the repo invariants every build step inherits (`fri-<name>` naming, the token ladder, `@layer theme/base/components/utilities` order, `src ↔ exports`, the contrast floor, every value distinct), taken verbatim from `CLAUDE.md` and `packages/styles/design.md` rather than restated. No placeholders: "the usual variants" or "like Button" → enumerate every value with its token. Recording it on GitHub is `component-ship` and needs explicit authorization.

## Done — the contract

- [ ] Premise resolved — exists, or extends a `bases/` pattern — with the real problem named.
- [ ] Primitive chosen and justified against the existing component it is most like.
- [ ] Variant ladder fixed, reusing the repo vocabulary, every value distinct with its `fri-<name>-<value>` class.
- [ ] Token map onto the generated `--fri-<role>` ladder, no invented colors; state list named.
- [ ] Surface and demo plan (including `BaseClassDefault` and a class-only proof) that `component-build`'s contract can check against.
- [ ] No build action taken — design only.

## Verify

- Re-read the ladder: would any two values share a class or token, or any color be hardcoded instead of a `--fri-<role>` slot? That is a defect — fix it here.
- Optional sub-agent: have a reviewer pressure-test the premise and ladder for gaps — a missing state, an ambiguous variant — before any build.

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Primitive                     | Variants                 | Sizes     | Tokens               | States         |
| ----------------------------- | ------------------------ | --------- | -------------------- | -------------- |
| `aria`/`native` — `<wrapped>` | `<roles>` × `<variants>` | `<xs…xl>` | `--fri-<role>` slots | `<data-attrs>` |

## Red flags — STOP

- Deciding variants before the primitive → the primitive gates the props; choose it first.
- Inventing a color or size vocabulary when the repo set fits → reuse `primary…danger`, `solid…plain`, `xs…xl`.
- Hardcoding a color instead of the `--fri-<role>` ladder → use the ladder.
- "Figure out variants while coding" → a vague design propagates into every surface; fix it here.
- Recording a design to the shared tracker without explicit per-artifact authorization → STOP.

## What this encodes

- The existing `bases/` components are the pattern menu: `button` (aria + full ladder), `text`, `flex` (`.types.ts`), `grid` (layout), `scroll-area` (radix + `.namespace.ts`), `separator`, `spinner`.
- The generated `--fri-*` token ladder (roles + slots) comes from `packages/styles/tokens/default.spec.json`; the five surfaces and the react/styles split: `CLAUDE.md` → Architecture, `button.css`.
- Shared-tracker discipline lives in `component-ship`.
