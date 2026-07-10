---
name: component-implement
description: Use to build and ship a base component in @friday-sandbox/react from an approved issue — "implement issue #N", "build and ship the Button", "add a Tooltip", "take the component to a PR", branching from a component issue, or getting the gates or CI green. The execution half after component-blueprint. Keywords class-variance-authority, fri-class, stories-as-tests, react-aria.
---

# Component implement

## Purpose

Ship an approved component issue: branch → scaffold → fill → gates → PR → green CI, then hand the review round to `component-rebut`.

## Input

- An approved component issue `#N` the user named this session — its body carries `component-blueprint`'s design + implementation plan.

## Tasks

1. **Branch.** Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"`. Confirm this session has **no other PR still open** — one PR in flight; a queued change waits locally until the current one merges. Confirm the issue is OPEN, unclaimed (`gh issue view <n> --json assignees,author`), carries `component-blueprint`'s design + plan, and the user named it this session. `gh issue develop <n> --checkout` (branch starts `<n>-`, off the default branch, one concern). Stage only this change's files.
2. **Scaffold.** `pnpm gen component --args <name> <primitive> <category> <parts>` — `primitive` = `aria` (interactive) or `native` (display/layout, incl. non-interactive react-aria parts); `parts` = comma-separated PascalCase subparts or `""`. Emits the 5 surfaces + `index.ts` + `.changeset/<name>-component.md`; wires the 2 react barrels, styles `index.css`, docs `meta.json`; adds `<name>.namespace.ts` + a subpart stub per part for a compound.
3. **Dispatch the builder — one bounded sub-agent builds every surface.** Send one **sonnet** sub-agent exactly four things: the issue body verbatim, the scaffolded file paths, the names of the two newest sibling components as local-pattern references, and steps 4–9 below as the build contract. Withhold everything else — no chat history, no prior or deleted version, no session narrative; a builder that sees only its contract cannot drift on it. The builder edits only the scaffolded surfaces (plus `.storybook/main.ts` `optimizeDeps` and the `.storybook/constants/` modules when the contract says so), returns the changed-file list, and never runs git, never touches another component, never judges its own work. One builder per component — never parallel builders on mirror surfaces. The main thread stays the orchestrator: it verifies, looks, audits, and ships. Steps 4–9 are the builder's contract:
4. **Swap the primitive.** Replace the scaffold placeholder with the real part — a react-aria-components part (`AriaButton`), a radix part (`scroll-area`), or a semantic element (`kbd`/`code`). Widen props to `ComponentPropsWithRef<typeof X>`. Compose className via `composeTailwindRenderProps` for a render-prop primitive. Add `"use client"` for a client primitive. Import the per-component subpath (`react-aria-components/<Part>`, `react-aria-components/composeRenderProps`) and add each to `optimizeDeps.include` in `.storybook/main.ts`; a radix part imports the `radix-ui` barrel (`scroll-area`) and needs no `optimizeDeps` entry. Keep the scaffold's import order when inserting the primitive — external imports and their types come before relative ones (`next-friday/sort-imports`).
5. **Fill the ladder, one value end to end** — class in `<name>.styles.ts` → rule in `<name>.css` → story cell → next value. Vocabulary: color `primary secondary accent info success warning danger`; `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`. Every value a distinct `fri-<name>-<value>`; set `defaultVariants`. Keep the flat `cva("fri-<name>", { variants })`; a compound part gets its own `<name><Part>Variants` map, root map first.
6. **Mirror `<name>.css` to `.styles.ts` 1:1** (`button.css`): base in `@layer components`; geometry from `--_<name>-n`; radius `calc(var(--fri-<archetype>-radius) * var(--_<name>-n) / <md-n>)` (`action` buttons, `field` inputs, `box` surfaces); one class per color/variant/size; `:where(.fri-<name>)` bakes the `md` default — **except a size that cascades from a container part**: there the child defines no default (no `defaultVariants` size, no `:where` bake) and the base consumes `var(--_<name>-n, <md-n>)`, so the container's inherited value wins (`avatar.css`); states via `[data-hovered] [data-pressed] [data-disabled] [data-focus-visible]` + `transition-base focus-ring status-disabled`. The base `@apply` list is the scaffold's baseline plus only the utilities the issue's base-look inventory names (width, position, cursor); `transition-[…]` lists exactly the properties the state rules change — never another archetype's list. `@apply` only — a non-utility property becomes a named `@utility` in `layers/utilities.css`.
7. **Stories = tests** (`button.stories.tsx`, Vitest in Chromium): the showcase trio only ([`.claude/rules/stories-docs-sync.md`](../../rules/stories-docs-sync.md)) — `Default`, plus `Variants` for a `variant` axis (every value, `Flex`/`Grid`; a color or shape axis joins that grid), plus `Sizes` for a `size` axis; no per-state or use-case story — use cases are the designer's, after ship. An independent sibling part (a namespace part with its own `cva()` map, like a `Group`) gets one showcase story named after the part, with a `play` asserting **every mechanic the issue gives the part** (the size cascade and the paint order — one assertion each, never a sample) — `lint:symmetry` gates the story. The scaffold's `Default` play is the contract: adapt its selector to the real element, add or remove no assertion (more behavior belongs to use-case stories). `argTypes` holds exactly one entry per `meta.args` key, per variant axis, plus `className` — no control for a prop no arg or story sets. Content props (children, `placeholder`, the accessible name) live in `meta.args` and flow through `{...storyArgs}`; a per-instance override only labels the story's subject value. Keep the scaffold's showcase layout unless the issue states otherwise; placeholder content from `@friday-sandbox/react/samples` (`Boxes`, `Lorem`), layout with `Flex`/`Grid`.
8. **Docs `<name>.mdx`** on the [`.claude/rules/doc-skeletons.md`](../../rules/doc-skeletons.md) component-doc spine, complete from the design, with one `##` feature section per showcase story carrying the same name (`Variants`, `Sizes` — `lint:symmetry` checks the mirror). Purpose is one or two sentences on what the component does for the consumer — no implementation internals (data attributes, wrapped-library mechanics; `prose-voice.md` audience), and never name a component that does not exist in the tree.
   - **Props** — doc-skeletons' column set, one row per prop; one table per part for a compound (`### <Name> Props` for a callable root, then `### <Name>.<Part> Props` per part — `lint:symmetry` checks headings and columns).
   - **Styling** — every `fri-<name>-<value>` class as a row; a `### State selectors` `[data-*]` table for an interactive base.
   - Set the real `STORYBOOK_URL`; drop the `headless` prop when the part has no standalone page.
   - No blank line inside an indented JSX or fence body within `<Tabs>` — markdownlint parses the continuation after the blank as an indented code block (MD046).
9. **Compound.** Callable-root (`link`/`grid`) — pass `parts`, auto-wired. Namespace-of-parts (`scroll-area`) — scaffold single, hand-write `.namespace.ts` + barrel blocks. Props live inline in `<name>.tsx`; a compound with **three or more parts** always moves them to `<name>.types.ts` (`avatar`, `scroll-area`), one or two parts stay inline (`link`, `grid`); a single component with complex prop types may also split (`flex`).
10. **Changeset.** Keep the generated `<name>-component.md`. A non-generated behavior change → `pnpm changeset` once.
11. **Verify, then overlap the judges — audits and the visual loop run together.** Run `bash "${CLAUDE_SKILL_DIR}/scripts/verify-component.sh" <name>`; the moment it passes, dispatch the two audit agents from the Acceptance criteria (**opus**, parallel, unmerged) in a single message, then run `pnpm --filter @friday-sandbox/react run visual <name>` while they work — it boots (or reuses) Storybook on :6006 and screenshots every story export to a temp directory, printing the paths. Read every screenshot and judge it against the issue's design: every variant a distinct hue, every size a distinct step, tokens resolved (no browser-default rendering), layout intact, each container mechanic (a cascade, a paint order) visible. A defect from either judge → fix at the source layer (route a contract-level fix back through the builder; apply a one-line mechanical fix directly), re-verify, re-look; every audit Critical/Important and every screenshot mismatch settles before the PR. Never push a component whose screenshots you have not read this round.
12. **PR.** Gates via the hooks. Title `type(scope): subject` ≤50, lowercase imperative; `Closes #<n>` in the body; fill the template. CI validates both that the body closes an issue and that the branch's `<n>-` prefix points at that OPEN issue — get the branch name right **before** opening the PR, because renaming a branch under an open PR closes the PR permanently (GitHub does not retarget it).
13. **CI.** `gh pr checks <pr> --watch` to green; a failing check → fix by root cause, push, re-watch; "no checks configured" is not a failure. Hand the AI-review round to `component-rebut`.

## Rules

- Act only on an issue the user explicitly named this session — OPEN, unclaimed, yours. Never auto-match by title; never branch/push/PR without a per-artifact yes; never touch an artifact this session didn't create ([`CONTRIBUTING.md`](../../../CONTRIBUTING.md), [`.claude/rules/no-guessing.md`](../../rules/no-guessing.md)).
- Build only the issue's spec + the generator template. A prop, variant, or axis not in the issue is a `component-blueprint` gap — loop back, never guess it here.
- Build from the issue and the live tree only — never seed any surface from git history or a deleted/prior version; a dropped implementation is not a reference ([`.claude/rules/no-guessing.md`](../../rules/no-guessing.md)).
- Mirror 1:1 — no orphan class either side; every value a distinct class.
- Semantic Tailwind alias only (`gap-small`, `p-medium`); never a raw numeric (`gap-1`), a bare `gap-(--fri-*)`, or a hardcoded color.
- One changeset. Never `--no-verify`; never disable or loosen a gate — fix the root cause.
- A dependency bump is proven on a lockfile-faithful install — `pnpm dedupe`, reinstall, then the scoped gates — before it ships; a stale `node_modules` turns every local gate into a false green.
- Ship exactly the showcase trio the axes call for; do not author use cases, per-state stories, or extra doc sections. Do not hand-write boilerplate the generator emits — fix `turbo/generators/` instead.
- The builder sub-agent receives only its four inputs (issue body, scaffold paths, sibling references, the build contract); chat history and prior versions stay out. Its output is judged only by the gates, the visual loop, and the audits — never by itself.
- Sub-agent tiers match the duty: **sonnet** builds and fetches, **haiku** only a lone single-pattern grep, **opus** judges (audits, adversarial review). The judge is never the builder; the builder is never opus.

## Acceptance criteria

- `<name>.styles.ts` and `<name>.css` mirror 1:1 — every class on both sides, no orphan, every value distinct.
- Scoped run passes: `bash "${CLAUDE_SKILL_DIR}/scripts/verify-component.sh" <name>` (stories, types, eslint, symmetry in one shot).
- The visual loop ran on the final code: every screenshot from `pnpm --filter @friday-sandbox/react run visual <name>` read and matched to the issue's design this round.
- The audit is clean: two parallel un-merged sub-agents on opus — **Standards** (token ladder, `:where()` default, ramp geometry, doc-skeletons spine, `data-slot`) and **Spec** (right primitive, planned ladder, every demo, scope creep), grading Critical/Important/Minor; every Critical and Important fixed; builder ≠ verifier.
- Branch matches `^<n>-`; title parses ≤50; one changeset covers the change; gates green via the hooks + CI. Escalate to `component-blueprint` after the third thrashing fix ([`references/DIAGNOSING.md`](references/DIAGNOSING.md)).

## Checklist

Materialize as tracked tasks at start, one per item; tick only on the verifier's real output.

- [ ] No other PR of this session open — verifier: `gh pr list --author "@me" --state open`
- [ ] Issue OPEN, unclaimed, designed, named this session — verifier: `gh issue view <n> --json state,assignees`
- [ ] Branch `<n>-…` off the default branch — verifier: `git branch --show-current`
- [ ] Scaffold emitted in full — verifier: `pnpm gen component` output lists every surface
- [ ] Builder dispatched with the bounded brief (four inputs, nothing else) — verifier: the dispatch prompt + the returned changed-file list
- [ ] Primitive swapped, props widened, `optimizeDeps` wired — verifier: the `<name>.tsx` / `.storybook/main.ts` diff
- [ ] Ladder filled, css mirrored 1:1, stories trio, docs spine — verifier: `pnpm lint:symmetry`
- [ ] Changeset present — verifier: `.changeset/*.md` in `git status`
- [ ] Scoped gates green — verifier: `verify-component.sh <name>` output
- [ ] Audits fired at verify-green, visual loop run while they work, every screenshot read — verifier: the dispatch timestamps + `pnpm --filter @friday-sandbox/react run visual <name>` paths + the image reads
- [ ] Audit clean, every Critical/Important fixed — verifier: both audit agents' verdicts
- [ ] PR open with `Closes #<n>`, CI green — verifier: `gh pr checks <pr> --watch`

## Output

| Issue  | Branch       | Component | Variants                     | Gates               | PR                      |
| ------ | ------------ | --------- | ---------------------------- | ------------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<name>`  | `<roles>×<variants>×<sizes>` | pass via hooks + CI | `#<pr>` (`Closes #<n>`) |
