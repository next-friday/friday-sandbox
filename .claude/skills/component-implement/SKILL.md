---
name: component-implement
description: Use to build and ship a base component in @friday-sandbox/react from an approved issue — "implement issue #N for the component", "build and ship the Button", "add a Tooltip", "take the component to a PR", branching from a component issue, or getting the component's gates or CI green. The execution half after component-blueprint; covers generate → fill surfaces → gates → PR → green CI. Keywords tailwind-variants, fri-class, stories-as-tests, react-aria.
---

# Component implement

The execution station for `@friday-sandbox/react` base components: take an approved component issue (designed and planned by `component-blueprint`) and deliver it — branch → build → gates → PR → green CI, then hand the AI-review round to `component-rebut`. The build itself is the real work: `pnpm gen component` scaffolds a generic stub; you swap in the primitive, fill the variant ladder, and mirror it in `@friday-sandbox/styles`, proven against a fixed contract.

```text
approved issue (design + plan, from component-blueprint)
  └→ branch from the issue (<n>-)
       └→ build to the contract (generate → primitive → ladder → css mirror → stories → docs)
            └→ changeset + gates (via hooks) → PR (Closes #<n>) → green CI
                 └→ on push, AI reviewers re-review → hand off to component-rebut
```

## When to use

- An approved component issue is ready to build and ship, or a component needs building, fixing, or completing (a leftover stub, empty/asymmetric variants, missing stories or styles, half-done work).
- Not this station:
  - Primitive, variant ladder, or tokens not settled, or no issue/plan yet → `component-blueprint` first.
  - Bot-review comments after the PR opens → `component-rebut`.

## Steps

The spine is **branch → build → ship**. The build detail lives in [Building the component](#building-the-component) below; the ship steps wrap it.

1. **Branch from the approved issue.** The tracker is shared — work only from an issue the user **explicitly named** this session (a bare invocation with no number → STOP, `gh issue list`, ask which; never auto-select). Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"` first; it fails fast with the fix if `gh` is unauthenticated or there's no GitHub remote. Confirm the issue carries `component-blueprint`'s approved design + plan; if it doesn't, go back to `component-blueprint`. Confirm it's unclaimed and yours (`gh issue view <n> --json assignees,author`) — an assignee or an in-flight linked branch by another agent → STOP and ask. Then `gh issue develop <n> --checkout`; the branch MUST start `<n>-` (a CI check in `.github/workflows/pr-validate.yml` rejects otherwise, and requires the issue OPEN), off the default branch, one concern. Keep the working tree to that one concern: uncommitted changes from another concern ride along on checkout and — because pre-push gates run whole-repo — can block the push even though they're unstaged; commit or stash them first (`git stash push -- <path>`, pop after), and stage only this change's files.
2. **Build the component to its contract** on that branch — see [Building the component](#building-the-component). Self-check the mirror, run the scoped story file, then the two-axis sub-agent audit; iterate until the build contract holds. Build only what the approved issue specifies plus what the generator template emits — invent neither prop nor variant. If the spec shifts here (a renamed prop, a dropped axis), or the issue never specifies a prop/variant you need, that is a `component-blueprint` gap: loop back through `component-blueprint` and return — never guess it here. Cheap while local, costly once the PR is open.
3. **Settle the changeset — check before adding.** A generated component ALREADY carries `.changeset/<name>-component.md` (`@friday-sandbox/react` + `@friday-sandbox/styles`, both `minor`); verify its user-facing summary in `.claude/rules/prose-style.md` voice and do NOT add a second. For a behavior change WITHOUT a generated changeset (a `feat`, `fix`, `perf`, `refactor`) run `pnpm changeset` once. Pure tooling or chore needs none. CI blocks a behavior change that arrives without one.
4. **Gates via the hooks.** Pre-commit runs them on staged files; pre-push runs the full gate suite — the list lives in [`CONTRIBUTING.md`](../../../CONTRIBUTING.md). Do not run whole-repo gates by hand; never `--no-verify` or disable a rule — fix the root cause. No completion claim without fresh evidence: the hooks' output is the proof, never "should pass".
5. **Open the PR.** Title is Conventional Commits per [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) — `type(scope): subject`, ≤50 chars, lowercase imperative, no body or footer. Put `Closes #<n>` in the BODY, never the title. Fill the PR template; add a screenshot for visual changes.
6. **Verify CI, then hand to `component-rebut`.** Local gates green is necessary, not sufficient. `gh pr checks <pr> --watch` blocks until the checks settle; read the rows to tell green from a failing check (a failing check → debug by root cause per step 4, fix, push, re-watch), and treat "no checks configured" as not-a-failure — report it, don't loop. Green is NOT the finish line: on push the AI reviewers (CodeRabbit, Gemini) re-review → **hand off to `component-rebut`** for the triage round — it machine-confirms CI + reply coverage (its own `ci-status.sh` / `verify-coverage.sh`) before the human gate; never answer bot comments inline here.

## Building the component

The component-specific work of step 2. The generator owns the symmetric scaffold; you fill only judgment.

1. **Generate — never hand-create.** `pnpm gen component` prompts for the name (kebab or words), the **primitive kind** (`native` for display/layout, `aria` for interactive), and the Storybook category — or, when an agent or unattended run cannot answer the prompts, pass them positionally: `pnpm gen component --args <name> <primitive> <category>` (e.g. `--args label native Forms`). It writes 7 files — the five surfaces, the component's `index.ts`, and `.changeset/<name>-component.md` (`@friday-sandbox/react` + `@friday-sandbox/styles`, both `minor`) — and wires the 2 react barrels (`bases/index.ts`, `src/index.ts`), `packages/styles/src/components/index.css`, and the docs `meta.json`, idempotently. The changeset is already written — do not add a second. `native` scaffolds a minimal `<div>`; `aria` scaffolds the interactive skeleton (`size` axis, ramp geometry, focus/disabled states, interaction + base-class stories). For a fix/complete the files already exist; read them first.
2. **Make it the real component.** Swap the scaffold's placeholder element for the real primitive and widen the props:
   - **`native` scaffold** (`<div data-slot="<name>">`, `variants: {}`): if it wraps a primitive, swap the `div` for it — a react-aria-components part (`AriaButton` per `button.tsx`, or a non-interactive part like `AriaLabel`) or a radix part per `scroll-area`; for a plain semantic element (`kbd`, `code`, `mark`, `samp`), swap to that tag with its matching `ComponentPropsWithRef<"kbd">` (not `"div"`).
   - **`aria` scaffold** (interactive skeleton over a native `<button>` with a `size` axis): swap the `<button>` for the specific react-aria primitive and add the `color`/`variant` axes the component needs.
   - **Either way**: keep `data-slot="<name>"`, widen props to `ComponentPropsWithRef<typeof X>`, and for render-prop primitives compose className through `composeTailwindRenderProps` (`components/utils/`).
   - **`"use client"`**: add it at the top when you swap in a react-aria/Radix client primitive — the `native` scaffold omits it (correct for a plain element, required once a client part is wrapped), matching `text.tsx`/`button.tsx`.
   - **Import the per-component subpath** (`react-aria-components/<Part>`, e.g. `react-aria-components/Button`, plus shared helpers on their own subpath like `react-aria-components/composeRenderProps`), matching `button`/`text`/`separator` — always; the deep path lets the bundler drop the rest of the library instead of pulling the whole barrel. A subpath Vite hasn't pre-bundled, though, makes Storybook/Vitest re-optimize mid-run and the import fails, so **every subpath you add must also be listed in `optimizeDeps.include` in `.storybook/main.ts`** — add the part's subpath there in the same change (addon-vitest reuses that Vite config, so one entry covers both Storybook and the Vitest stories).
   - **Parallelize the read-only research**: when you must confirm the primitive's real props and match the sibling pattern — its installed `.d.ts`, the library's `.md` page, `button.tsx`/`text.tsx` and their `.css` — dispatch those reads as concurrent **sonnet** sub-agents in one message; they return the confirmed prop/type surface and the pattern to mirror, no edits. The main thread does the swap. Size sub-agents to the task: **sonnet** for mechanical reads like this, **opus** for the judgment audit in [Verify](#verify), **haiku** for a lone grep — the builder never grades its own work.
3. **Fill the ladder — one value end to end, not all-at-once.** Take each variant value through its surfaces before the next: its class in `<name>.styles.ts` → its rule in `<name>.css` → its story cell → confirm it renders, then the next value. Vertical slices keep `lint:symmetry` green per increment and catch a wrong token mapping on value #1 instead of copied across all six. Reuse the repo vocabulary, do not invent: color roles `primary accent info success warning danger`; visual `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`; boolean modifiers as needed. Every value → a distinct `fri-<name>-<value>` class; set `defaultVariants`. Keep the variants shape the generator emits — a flat `tv({ base: "fri-<name>", variants })` — unless the component genuinely has multiple slots (then `slots: { … }`, see `scroll-area`); don't refactor a single-slot component to the `slots` form to match `text`/`separator`. For a **sized display** component, mirror `label`'s size ladder by hand — `size` `sm`/`md`/`lg` → `text-label-<size>` with the `:where()` md default — since the native scaffold emits no size axis (the `aria` scaffold's size ramp is interactive geometry, wrong for display).
4. **Mirror in `packages/styles/src/components/<name>.css`** — a sibling package to the `<name>.styles.ts` it mirrors, linked only by the `fri-<name>` class name — following `button.css`. Style every rule through `@apply`; a property Tailwind has no utility for becomes a named `@utility` in `layers/utilities.css` (see `status-disabled`, `scrollbar-thin`), never a raw declaration (the apply-only gate rejects it, so recording one would contradict the build). `--*` custom-property defs (the ramp multiplier) are var machinery and stay:
   - `.fri-<name>` base in `@layer components`, geometry from a component-local ramp multiplier (`--_<name>-n`) so one number drives height, padding, spinner, **and corner radius**. Radius scales with the ramp, anchored at the `md` step to the archetype token — `--<name>-radius: calc(var(--fri-<archetype>-radius) * var(--_<name>-n) / <md-n>)`, applied as `rounded-(--<name>-radius)` (see `button.css`: `action` archetype, md `--_button-n` = 10) — so `md` equals the archetype base and roundness stays proportional across sizes. Pick the archetype by kind: `action` for buttons/badges, `field` for inputs, `box` for cards/surfaces. The ramp and radius formula live per component in its CSS (each component's sizing is its own), never hoisted to a global token.
   - one `fri-<name>-<color>` class per role, wiring the ladder into local slots (`--fri-<role>` plus its `-foreground`, `-hover`/`-pressed`, `-soft`/`-soft-hover`/`-soft-pressed`, `-surface`/`-surface-hover`/`-surface-pressed`, `-border`, `-outline-border`, `-tint-hover`/`-tint-pressed` steps — the full set is in `button.css`).
   - one `fri-<name>-<variant>` class mapping those slots onto background / foreground / border.
   - size classes set only `--_<name>-n` and `text-label-<size>`; bake the `md` default at zero specificity with `:where(.fri-<name>)`.
   - states via react-aria data attrs (`[data-hovered] [data-pressed] [data-disabled] [data-focus-visible]`) and repo utilities (`transition-base focus-ring status-disabled`).
   - mirror **1:1**: every variant value has its class here, none orphaned either side.
5. **Stories in `<name>.stories.tsx` ARE the tests** (Vitest in Chromium via Playwright, `storybook/test`). Follow `button.stories.tsx`:
   - **Showcase coverage**: full `argTypes`; one story per variant axis (every value, laid out with `Flex`/`Grid`) and one per state — render-only, no `play`. Never a raw `<div>` for layout or placeholders — lay out with `Flex`/`Grid` and pull placeholder content from the samples (`Boxes`, `Lorem` via `@friday-sandbox/react/samples`); the `lint:symmetry` gate fails a raw `<div>` in a story or doc, and additionally fails a raw `<span>`/`<p>`/`<h*>`/`<button>` in a **doc** — dogfood `<Text>` (text and headings) and `<Button>` there, `<Lorem>` for copy (stories may keep `<span data-testid>` probes).
   - **Interactive bases**: add `play` on `Default` (interaction — `userEvent.tab()` → `toHaveFocus`, keyboard → a `fn()` handler).
   - **Display/layout bases** (text, flex, grid, separator, spinner): skip only the `userEvent` behavior plays — a presence (`toBeInTheDocument`) or `getComputedStyle` assertion on `Default` is still welcome.
   - **Keep probe stories lint-clean**: lift any inline `style={{…}}` object to a module const and give every probe element a `data-testid` — a bare `<span>`/`<div>` or inline-object prop trips `next-friday/no-ghost-wrapper` and `jsx-simple-properties`.
6. **Docs `<name>.mdx`** — the `.claude/rules/prose-style.md` spine: `<SourceLinks>` header, Import, Usage, Purpose, When to use, When not to use, [feature sections — one demo each], Props, Styling, Accessibility last. Replace the scaffold's `STORYBOOK_URL` with the component's published Storybook page, and `HEADLESS_DOCS_URL` in the `<SourceLinks>` header with the wrapped library's component page; **drop the `headless` prop entirely** when the wrapped part has no standalone page — a plain HTML element, or a react-aria sub-part like `Label`/`Text` that only lives under a parent or as a hook — never ship a link that 404s. The generator slotted `<name>` under its `---Category---` group in `components/meta.json` `pages` (matching the Storybook category); order it sensibly within that group.
7. **Compound component?** The generator wires ONE export name. For multiple parts (`Grid` + `GridItem`, `ScrollArea` + parts) add the extra `export {…}` / `export type {…}` blocks by hand to `bases/<name>/index.ts`, `bases/index.ts`, and `src/index.ts`, mirroring the existing Grid / ScrollArea blocks. Complex props → `<name>.types.ts` (see `flex`); compound API → `<name>.namespace.ts` (see `scroll-area`).

## Done — the contract

- [ ] Branch starts `<n>-`, off the default branch, one concern; the issue was explicitly named, unclaimed, and yours.
- [ ] The scaffold's placeholder element swapped for the real primitive where needed (no leftover stub `<div>` / `<button>`), variants filled.
- [ ] Variant vocabulary reuses the repo set, every value a distinct `fri-<name>-<value>`, `defaultVariants` set.
- [ ] `<name>.css` mirrors `.styles.ts` 1:1 — self-checked by reading the two, enforced by the pre-commit `lint:symmetry` hook — via the ladder + `:where()` default + ramp-multiplier pattern; no orphan class either side; no hardcoded color.
- [ ] States wired via react-aria data attrs and repo utilities (`focus-ring`, `status-disabled`, `transition-base`).
- [ ] Stories cover every variant value and every state; interactive bases add `play` on `Default`, display/layout bases skip only the `userEvent` interaction plays (a presence or `getComputedStyle` assertion on `Default` still fits); all pass (scoped run).
- [ ] mdx on the `.claude/rules/prose-style.md` spine; `meta.json` carries `<name>`. Compound exports / `.types.ts` / `.namespace.ts` added if needed.
- [ ] Exactly one changeset — the generated `<name>-component.md`, not a duplicate (or one `pnpm changeset` for a non-generated behavior change).
- [ ] Gates green via the hooks, nothing suppressed. PR title valid Conventional Commits ≤50; `Closes #<n>` in the body; template filled.
- [ ] CI watched to green (`gh pr checks`), then the AI-review round handed to `component-rebut` (which machine-confirms CI before the human gate).

## Verify

- **Self-check the mirror first** by reading `<name>.styles.ts` against `<name>.css`: every `fri-<name>-<value>` on one side has its rule on the other, no orphan either way, every value distinct. Do **not** run `pnpm lint:symmetry` by hand — `CLAUDE.md` reserves it and the other whole-repo gates for the pre-commit/pre-push hooks, which enforce the mirror deterministically at commit.
- Self-check each Done box, surface by surface. Self-grading is unreliable, so check against the boxes, not memory.
- Then dispatch the judgment to **two parallel sub-agents, kept un-merged** so one axis can't mask the other — both on **opus** (this is judgment; don't cheap it out), fired in one message:
  - **Standards** — conventions no script checks: token-ladder only (no hardcoded color), repo vocabulary reuse, the `:where()` default, ramp-multiplier geometry, the `.claude/rules/prose-style.md` mdx spine, `data-slot`. Skip anything tooling already enforces.
  - **Spec** — fidelity to the issue's design and the Done contract: the right primitive, the exact planned variant ladder, every planned demo present, and scope-creep (anything in the diff that wasn't asked for).
    Harden the dispatch: never write "do not flag" or "at most Minor" (that pre-judges the auditor); treat the builder's report as unverified claims (a stated rationale never lowers a finding's severity); grade each finding Critical / Important / Minor. Fix every Critical and Important; re-audit if anything was found. Builder ≠ verifier; never force the same model to retry unchanged.
- Stories are the gate. Verify with the scoped single-file run `pnpm --filter @friday-sandbox/react exec vitest run <name>` (blessed in `CLAUDE.md` Commands, not a whole-repo gate), so a broken `play` or a vacuous assertion surfaces here, not at CI. Let the hooks run the full suite.
- Confirm the branch matches `^<n>-`, the title parses as `type(scope): subject` within 50 chars, and exactly one changeset covers the change. Do not claim green from memory — the hooks' and CI's output is the evidence.
- A gate red? Diagnose the root cause before patching, and escalate to `component-blueprint` after the third thrashing fix — see [`references/DIAGNOSING.md`](references/DIAGNOSING.md).

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Issue  | Branch       | Component | Variants                     | Gates               | PR                      |
| ------ | ------------ | --------- | ---------------------------- | ------------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<name>`  | `<roles>×<variants>×<sizes>` | pass via hooks + CI | `#<pr>` (`Closes #<n>`) |

## Red flags — STOP

- About to act on an issue the user did not EXPLICITLY name, or matched by title/topic resemblance → STOP; ask for the `#N`, confirm it's unclaimed and yours.
- About to `gh issue develop`, branch, push, or PR without an explicit per-artifact yes, or on an artifact this session didn't create → STOP; authorship is not ownership.
- Left the `<div>` stub or empty `variants: {}` → unfinished generator output, not a component.
- Added a second changeset → the generator already wrote `<name>-component.md`; duplicates break the release.
- Invented a token, a raw Tailwind numeric scale (`ms-0.5`, `gap-1`), or a `gap-(--fri-spacing-*)` var form where a **semantic alias** exists (`gap-small`, `p-medium` map to `--fri-spacing-*` in `src/tailwind/theme.css`) → use the alias, never hardcode a color.
- Invented a prop, variant, or axis not in the approved issue → STOP; the spec is the issue (from `component-blueprint`) plus the generator template, never guessed. A prop or variant the issue doesn't specify is a blueprint gap — resolve it in `component-blueprint`, don't fill it in here.
- A variant class without its css rule, or the reverse → orphan; the mirror is broken. Two sizes or colors sharing a class → forbidden; every value distinct.
- A compound component with only the generated single export wired → add the extra blocks by hand. Hand-edited a barrel for a non-compound → the generator owns the single-name wiring.
- A variant value or state with no story, or an interactive base missing `play` → coverage gap.
- Hand-writing boilerplate the generator could emit → a template gap; fix `turbo/generators/`, don't free-gen it.
- `--no-verify`, disabling a rule, or "I'll fix the gate later" → forbidden; fix the cause. `Closes #n` in the title, or a subject over 50 chars or capitalized → invalid.
- Reporting "CI green, done" without handing the AI-review round to `component-rebut` → STOP; green CI is the precondition for review, not the finish.

## What this encodes

- The react/styles split linked by `fri-<name>`, the `--fri-*` token ladder, and the `@layer theme, base, components, utilities` cascade (`packages/styles/src/index.css`). Reference: `button` + `button.css`.
- Generator and templates: `turbo/generators/` (`native` scaffolds a div + empty variants; `aria` scaffolds the interactive skeleton; both come with an auto-changeset). Existing patterns to match: `button` (aria, full ladder), `text` (typography), `flex` (layout, `.types.ts`), `grid` (layout), `scroll-area` (radix compound, `.namespace.ts`), `separator`, `spinner`.
- Workflow, commit, changeset, and gate rules: `CONTRIBUTING.md`. Operating rules and the `src` ↔ `exports` invariant: `CLAUDE.md`. Tests-are-stories: `packages/react/vitest.config.ts` with `storybook/test`.
- Template-first: the generator owns the symmetric scaffold; fill only judgment. Boilerplate you hand-write across components is a **template gap** — fix `turbo/generators/`, never paper it over with free-gen. Determinism = symmetry + fewer tokens.
- The tracker is shared (`CONTRIBUTING.md`: claim before you start; one issue, one PR). Chromatic (`CHROMATIC_PROJECT_TOKEN`) can show red when its secret isn't configured (`.github/workflows/chromatic.yml`); whether a check blocks merge is branch-protection config — confirm via the PR's checks (see `component-rebut`).
