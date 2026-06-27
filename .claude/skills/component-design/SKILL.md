---
name: component-design
description: Use before building a base component in @friday-sandbox/react when its shape is not settled — which primitive to wrap (react-aria-components, radix-ui, base-ui, native), which color/variant/size ladder it needs, which tokens and states. Triggers "design a Tooltip", "what variants should X have", "plan this component". Not for docs, config, tooling, or other non-component design or planning.
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

1. **Premise — assume nothing; derive from docs, don't interrogate.** Don't presuppose the component or pre-fill answers from your own context. Ask the user only two things, in order: (a) **which component** (name); (b) **which headless library** it wraps — react-aria-components, Radix UI, Base UI, or native (step 2). The component's purpose, props, states, and whether it is interactive all come from that library's own docs — **fetch them** (step 2), do not ask the user what it does. Then settle repo-fit with the user: the variant / state / size set to expose, and whether it belongs here or extends a `bases/` component instead of duplicating (menu: `button`, `text`, `flex`/`grid`, `scroll-area`, `separator`, `spinner`).
   - **Then design it twice before converging** — if the shape isn't obvious, diverge on the API and visual structure (see [`references/DESIGN-IT-TWICE.md`](references/DESIGN-IT-TWICE.md)), pick or hybridize a winner, and carry it into the steps below. Skip when grilling already settled the shape in one pass.
2. **Pick the primitive, then the generator kind — they are two separate decisions.** First, what `<name>.tsx` wraps. The sanctioned headless sources are **react-aria-components**, **Radix UI**, and **Base UI** (or native HTML for pure layout/text); whichever you pick must be a workspace dependency. Ground the chosen part in that library's own docs, not memory — each publishes an LLM-readable markdown page per component; **fetch it** to confirm the real props, render-prop values, and data attributes before you map them:
   - react-aria-components → `https://react-aria.adobe.com/<Part>.md` (index: `https://react-aria.adobe.com/llms.txt`) — e.g. `button` wraps `AriaButton`.
   - Radix UI → `https://www.radix-ui.com/primitives/docs/components/<name>.md` — e.g. `scroll-area` wraps a Radix part.
   - Base UI → `https://base-ui.com/react/components/<name>.md` (index: `https://base-ui.com/llms.txt`).
   - native HTML (no library — `kbd`, `code`, `mark`, `samp`) → ground against the element's MDN page.

   Not every part has its own page: check the `llms.txt` index for the real path — some parts live inside a parent component's page (react-aria's `Label` is shown under `TextField`, not at `Label.md`) or only as a hook (`useLabel`). When the docs don't table a sub-part's props, read the installed TypeScript type (`node_modules/.../dist/<Part>.d.ts`) as the authoritative prop list. A headless part exposes only its own props — repo states like required/invalid/disabled are additions you design here, not props it already has. Second, the generator's `primitive` prompt is **interactivity, not library**: pick `aria` only for an interactive component (focus/hover/press, a size ramp — it scaffolds that skeleton); pick `native` for any display/layout component, **including a react-aria primitive that carries no interaction state** (Label and Text wrap react-aria parts but scaffold as `native`, then swap the placeholder `<div>` for the part in `component-build`). The wrapped primitive gates the props, so choose it first.

3. **Resolve the variant ladder** — first decide whether the component is colored/interactive or structural. A **colored/interactive** component (button-like) reuses the full vocabulary: color roles `primary secondary accent info success warning danger`; visual `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`; boolean modifiers. A **structural/typography** component (label, text, separator-like) **drops the color and visual-variant axes entirely** — state that as the reason — and uses only its domain axis (a typography scale, an orientation) plus boolean state modifiers; mirror `text.variants.ts` / `separator.variants.ts`, not `button`. Either way, add a new axis only with a stated reason, every value distinct, each with its `fri-<name>-<value>` class.
4. **Map tokens and states.** A **colored** component maps each color → the generated `--fri-<role>` ladder slots (`-foreground`, `-hover`/`-pressed`, `-soft*`, `-surface*`, `-border`, `-outline-border`, `-tint-*` — the full set is in `button.css`), size → the ramp-multiplier pattern, and references `button.css`. A **structural** component reuses existing tokens instead — neutral `text-foreground`, the `text-label-*` / typography scale, `text-danger`, and the shared `status-disabled` utility (`shared/utilities.css`) — and references `text.css` / `separator.css`, not `button.css`. Never hardcode a color. States: which react-aria data attrs apply (`data-hovered`, `data-pressed`, `data-disabled`, `data-focus-visible`, plus component-specific).
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
- Forcing the color or visual-variant ladder onto a structural component (label, text, separator) → drop those axes; use the domain axis plus boolean states.
- Choosing `aria` for the generator kind because the component wraps react-aria → `aria` means interactive; a non-interactive react-aria part (Label, Text) scaffolds as `native`.
- Hardcoding a color instead of the `--fri-<role>` ladder → use the ladder.
- "Figure out variants while coding" → a vague design propagates into every surface; fix it here.
- Recording a design to the shared tracker without explicit per-artifact authorization → STOP.

## What this encodes

- The existing `bases/` components are the pattern menu: `button` (aria + full ladder), `text`, `flex` (`.types.ts`), `grid` (layout), `scroll-area` (radix + `.namespace.ts`), `separator`, `spinner`.
- The generated `--fri-*` token ladder (roles + slots) comes from `packages/styles/tokens/default.spec.json`; the five surfaces and the react/styles split: `CLAUDE.md` → Architecture, `button.css`.
- Shared-tracker discipline lives in `component-ship`.
