---
name: component-blueprint
description: Use before building a base component in @friday-sandbox/react — design its shape (which primitive to wrap among react-aria-components, radix-ui, base-ui, native; which color/variant/size ladder; which tokens and states), then record the approved design and an implementation plan in a GitHub issue. Triggers "design a Tooltip", "plan the Badge component", "what variants should X have", "blueprint this component". Not for docs, config, tooling, or other non-component design.
---

# Component blueprint

The design station for `@friday-sandbox/react` base components: choose the primitive, the variant ladder, and the token mapping against the repo's existing vocabulary, then record the approved design + an implementation plan in a **GitHub issue** so `component-implement` has a fixed, branchable target. A precise design is the leverage; a vague one propagates into every surface. Grill one decision at a time; the design is done when an implementer could build it without asking another question. Recommend only what the docs or the live tree ground — the primitive's real props, the existing component it is most like. Never recommend, pre-fill, label "recommended", or float example values for what the human exposes — the prop, variant, size, and state set is the human's spec; elicit it with an open prompt and record it verbatim. A suggested value anchors the human and corrupts the spec exactly as a guess would.

```text
design interview → approved design (primitive + ladder + tokens + surfaces)
  └→ recorded in the GitHub issue body (design + implementation plan)
       └→ component-implement: branch from the issue → build → gates → PR (Closes #issue)
```

## When to use

- Before `component-implement`, for a new or reworked component whose primitive, variant ladder, or token mapping is not decided, or whose issue/plan does not exist yet.
- Symptoms: unsure which primitive to wrap, how many roles/sizes, which states, or what the doc demos are.
- Not this station:
  - Building or shipping the component (branch, gates, PR) → `component-implement`.
  - Bot-review comments after the PR opens → `component-rebut`.

## Steps

Steps 1–5 settle the design (no GitHub write); steps 6–7 record it to the issue, gated on explicit authorization.

1. **Premise — the spec comes from the human; never guess it.** Don't presuppose the component or pre-fill any decision from your own context. Ask the user four things, in order, and treat each answer as the authoritative spec: (a) **which component** (name); (b) **which primitive** it wraps — react-aria-components, Radix UI, Base UI, or native HTML (step 2); (c) **which props and variants to expose** — the prop set, the color/variant/size/state ladder, the boolean modifiers; (d) **any extra requirements** — an open free-text prompt for anything (a)–(c) don't capture: specific behaviors, accessibility needs, constraints, edge cases. (d) is optional (the human may have nothing to add) but always offer it; fold whatever they give into the spec, and never invent extra requirements they didn't state. Never invent the exposed prop or variant set, and never derive it from the library docs alone: the library docs (step 2) **ground** the answers — they confirm the part's real props, render-prop values, and types, and validate that the human's spec maps onto something real — but they do **not** replace the ask. A headless part's own props pass through (`ComponentPropsWithRef<typeof X>`); what the design decides — and what the human must specify — is which variants, sizes, states, and custom props to add on top. A prop or variant the human leaves unspecified is a question to ask, never a gap to fill yourself — and ask it open: no menu of candidate values, no "recommended" default, no example prop set floated for the human to react to. Then settle repo-fit with the user: whether it belongs here or extends a `bases/` component instead of duplicating (menu: `button`, `text`, `flex`/`grid`, `scroll-area`, `separator`, `spinner`). Confirm repo-fit against the live tree, not memory — list `packages/react/src/components/bases/` for what exists. Design only from that live tree, the human's spec, and the library docs; never seed the shape from git history or a prior/dropped version — stale shape corrupts a fresh design.
   - **Then design it twice before converging** — if the shape isn't obvious, diverge on the API and visual structure (see [`references/DESIGN-IT-TWICE.md`](references/DESIGN-IT-TWICE.md)), on parallel **opus** sub-agents (design divergence is judgment), pick or hybridize a winner, and carry it into the steps below. Skip when grilling already settled the shape in one pass.
2. **Pick the primitive, then the generator kind — they are two separate decisions.** First, what `<name>.tsx` wraps. The sanctioned headless sources are **react-aria-components**, **Radix UI**, and **Base UI** (or native HTML for pure layout/text); whichever you pick must be a workspace dependency. Ground the chosen part in that library's own docs, not memory — each publishes an LLM-readable markdown page per component; **fetch it** to confirm the real props, render-prop values, and data attributes before you map them:
   - react-aria-components → `https://react-aria.adobe.com/<Part>.md` (index: `https://react-aria.adobe.com/llms.txt`) — e.g. `button` wraps `AriaButton`.
   - Radix UI → `https://www.radix-ui.com/primitives/docs/components/<name>.md` — e.g. `scroll-area` wraps a Radix part.
   - Base UI → `https://base-ui.com/react/components/<name>.md` (index: `https://base-ui.com/llms.txt`).
   - native HTML (no library — `kbd`, `code`, `mark`, `samp`) → ground against the element's MDN page.

   When several candidate primitives are in play, fan out one fetch sub-agent per candidate in a **single message** rather than fetching serially; each returns the part's real props, render-prop values, and data attributes, no edits, for the main thread to weigh. Size sub-agents to the task throughout this skill: **sonnet** for mechanical fetch-and-read like this, **opus** for judgment (the design-twice divergence and the plan review), **haiku** for a lone grep — independent dispatches in one message run concurrently, and the author never grades its own work.

   Not every part has its own page: check the `llms.txt` index for the real path. A sub-part may live inside a parent component's page, exist only as a hook (`useLabel`), or have no documented page at all — react-aria's `Label` has no `Label.md` and isn't in `llms.txt` (its doc page 404s). A missing doc page never means a missing type: the part still ships an **installed TypeScript type, the authoritative source** — read it directly. Resolve the path rather than assume a flat `node_modules` (this repo is pnpm, so the part lives under `node_modules/.pnpm/…`): from `packages/react`, run `node -e "console.log(require.resolve('react-aria-components/package.json'))"`, then read `dist/types/src/<Part>.d.ts` (or `dist/types/exports/<Part>.d.ts`) beside it — e.g. `Label.d.ts` is present even though `Label.md` is not. A headless part exposes only its own props — repo states like required/invalid/disabled are additions you design here, not props it already has. Second, the generator's `primitive` prompt is **interactivity, not library**: pick `aria` only for an interactive component (focus/hover/press, a size ramp — it scaffolds that skeleton); pick `native` for any display/layout component, **including a react-aria primitive that carries no interaction state** (Label and Text wrap react-aria parts but scaffold as `native`, then swap the placeholder `<div>` for the part in `component-implement`). The wrapped primitive gates the props, so choose it first. Record the import as the part's **per-component subpath** (`react-aria-components/<Part>`, e.g. `react-aria-components/Label`), not the barrel — the deep path keeps the bundle to the part actually used; `component-implement` adds the matching `optimizeDeps.include` entry in `.storybook/main.ts`.

3. **Resolve the variant ladder** — first decide whether the component is colored/interactive or structural. A **colored/interactive** component (button-like) reuses the full vocabulary: color roles `primary accent info success warning danger`; visual `variant` `solid subtle surface outline ghost plain`; `size` `xs sm md lg xl`; boolean modifiers. A **structural/typography** component (label, text, separator-like) **drops the color and visual-variant axes entirely** — state that as the reason — and uses only its domain axis (a typography scale, an orientation) plus boolean state modifiers; mirror the **axis ladder** of `text.styles.ts` / `separator.styles.ts` (their domain axis + boolean states), not `button`'s color/variant axes. Record the `tv()` **shape the generator emits** — a flat `tv({ base: "fri-<name>", variants })` — even when borrowing those two's ladder: `text`/`separator` predate the generator and use `slots: { root }`, but `component-implement` keeps the flat `base` form, so recording `slots` would contradict the build. Either way, add a new axis only with a stated reason, every value distinct, each with its `fri-<name>-<value>` class.
4. **Map tokens and states.** A **colored** component maps each color → the `--fri-<role>` ladder slots (`-foreground`, `-hover`/`-pressed`, `-soft*`, `-surface*`, `-border`, `-outline-border`, `-tint-*` — the full set is in `button.css`), size → the ramp-multiplier pattern, and references `button.css`. A **structural** component reuses existing tokens instead — neutral `text-foreground`, the `text-label-*` / typography scale, `text-danger` (role colors resolve as `text-*` utilities because each is registered as a `--color-*` in the `src/tailwind/theme.css`), and the shared `status-disabled` utility (`layers/utilities.css`) — and references `text.css` / `separator.css`, not `button.css`. Never hardcode a color, and map spacing/size to its **semantic Tailwind alias** — `gap-small`, `p-medium`, `text-label-medium` (the `--fri-spacing-*` / `text-label-*` scales are mapped in `src/tailwind/theme.css`, so `gap-large` _is_ `--fri-spacing-large`) — never a raw Tailwind numeric (`ms-0.5`, `gap-1`) nor the bare `gap-(--fri-spacing-*)` var form; `component-implement` rejects raw numerics, so recording one would contradict the build. States: which react-aria data attrs apply (`data-hovered`, `data-pressed`, `data-disabled`, `data-focus-visible`, plus component-specific).
5. **Plan the surfaces and demos.** The five surfaces, and the stories — one per variant axis (laid out with `Flex`), one per state — so `component-implement`'s build contract is pre-drawn.
6. **Converge, then record the design to the issue.** Only after the design has CONVERGED (user approved in chat, no open decisions) and an **explicit, per-artifact go-ahead** to write to the shared tracker — until then the design lives in chat or a temp `/tmp/<name>.md` draft. Then record it to a GitHub issue (see [Recording the design](#recording-the-design)): preflight `gh`, ASK before create (`create a new issue titled "<X>"?` or `update #N?`) — never auto-match by title — fill the repo's issue template via `--body-file`, title per the repo's enforced convention. The body carries: the primitive + ladder + token/state map + surface/demo plan + any extra requirements the human gave (so `component-implement` honors them), plus a **Global Constraints** block (the repo invariants every build step inherits — `fri-<name>` naming, the token ladder, `@layer theme/base/components/utilities` order, `src ↔ exports`, the contrast floor, every value distinct — copied verbatim from `CLAUDE.md` and `ARCHITECTURE.md`). No placeholders: "the usual variants" or "like Button" → enumerate every value with its token.
7. **Write the implementation plan in the issue body**, after the design. Write at task altitude: each task names what it does, the files it touches, and its **Done** (an observable behavior or contract) + **Verification** (the exact command). For a component the tasks map onto the build contract — swap the primitive, fill the ladder, mirror the css, write the stories, the mdx — each a checkbox naming `component-implement` as the executor. The body then holds design + plan as one artifact; `component-implement` branches from the issue and ships it.

## Recording the design

Detail for steps 6–7. The **issue body is the single source of truth** — never a committed repo file; `/tmp` is only the `--body-file` buffer.

- **Preflight.** Before any `gh` write, confirm `gh auth status` succeeds and the repo has a GitHub remote (`git remote -v`). No GitHub remote → STOP and ask how the user tracks work; this flow is GitHub-specific. (The full `preflight.sh` lives in `component-implement`, where the heavier branch/push runs.)
- **Create vs update: ASK, don't guess.** No relevant issue → confirm, then `gh issue create --title "<X>" --body-file /tmp/<name>.md`. A relevant issue the user named → `gh issue edit <n> --body-file …`. Never auto-match an issue by title or topic; if unsure which, ask for the number. One yes authorizes one named artifact, never a batch.
- **Use the repo's issue template.** Check `.github/ISSUE_TEMPLATE/` first; when one exists, read it and map the design onto its sections (YAML forms → emulate each field's label as a `### Label` heading). Pass the filled body via `--body-file` (never `--template`, which drops into an interactive editor). Title per the repo's convention — discover it from commitlint / a title-validation workflow / `git log`, don't invent.
- **Self-review the recorded body:** placeholders (TBD/TODO) gone, no internal contradiction, scope is one implementable plan, no requirement readable two ways. Fix by editing the body (`gh issue edit <n> --body-file`); GitHub keeps the edit history.

## Done — the contract

- [ ] Premise resolved — exists, or extends a `bases/` pattern — with the real problem named.
- [ ] Component name, primitive, the prop/variant spec, and any extra requirements all came from the human's answers, validated against the library docs — nothing guessed or derived from docs alone.
- [ ] Primitive chosen and justified against the existing component it is most like.
- [ ] Variant ladder fixed, reusing the repo vocabulary, every value distinct with its `fri-<name>-<value>` class.
- [ ] Token map onto the `--fri-<role>` ladder, no invented colors; state list named.
- [ ] Surface and demo plan that `component-implement`'s build contract can check against.
- [ ] Design + implementation plan recorded in the issue body (after explicit per-artifact authorization), or kept as a local draft when no write was authorized. No code or build action taken.

## Verify

- Re-read the ladder: would any two values share a class or token, or any color be hardcoded instead of a `--fri-<role>` slot? That is a defect — fix it here.
- Re-read the recorded body for placeholders, contradictions, and ambiguity before handing to `component-implement`; the plan is the spec it builds from.
- Sub-agent reviewer (**opus** — adversarial judgment): pressure-test the premise, ladder, and plan for gaps — a missing state, an ambiguous variant, an unprovable Done — before any build. Builder ≠ verifier: don't have the design's author grade it.

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Issue  | Primitive                     | Variants                 | Sizes     | Tokens               | States         |
| ------ | ----------------------------- | ------------------------ | --------- | -------------------- | -------------- |
| `#<n>` | `aria`/`native` — `<wrapped>` | `<roles>` × `<variants>` | `<xs…xl>` | `--fri-<role>` slots | `<data-attrs>` |

## Red flags — STOP

- Deciding variants before the primitive → the primitive gates the props; choose it first.
- Inventing a color or size vocabulary when the repo set fits → reuse `primary…danger`, `solid…plain`, `xs…xl`.
- Forcing the color or visual-variant ladder onto a structural component (label, text, separator) → drop those axes; use the domain axis plus boolean states.
- Choosing `aria` for the generator kind because the component wraps react-aria → `aria` means interactive; a non-interactive react-aria part (Label, Text) scaffolds as `native`.
- Hardcoding a color instead of the `--fri-<role>` ladder → use the ladder.
- Guessing the component, primitive, prop, or variant set — or pre-filling it from the library docs alone — instead of getting it from the human → STOP; the spec comes from the human, the docs only ground it. A prop the human didn't specify is a question, not a default.
- Recommending, suggesting, or offering a "recommended" option or example menu for what to expose (props, variants, sizes, states) → STOP. A floated value anchors the human as badly as a guess. Elicit the surface open and record it verbatim; recommend only doc- or tree-grounded facts, never the exposed surface itself.
- Recording a `slots: { root }` tv() shape, or a raw Tailwind numeric (`ms-0.5`, `gap-1`), that `component-implement` will not build → record the flat `tv({ base })` shape and `--fri-*` tokens the generator and build actually use, so the design matches the code.
- "Figure out variants while coding" → a vague design propagates into every surface; fix it here.
- Recording to the shared tracker before the design has converged, or without an explicit per-artifact yes → STOP. A design approval is not a write authorization; one yes authorizes one named artifact, never a batch.
- Matching an issue to the request by title or topic resemblance → STOP; confirm the number with the user.

## What this encodes

- The existing `bases/` components are the pattern menu: `button` (aria + full ladder), `text`, `flex` (`.types.ts`), `grid` (layout), `scroll-area` (radix + `.namespace.ts`), `separator`, `spinner`.
- The `--fri-*` tokens are hand-authored in `packages/styles/src/themes/default/` — per-mode seeds (roles, ground, scales) in `tokens.css`, the derived ladder (roles + slots) in `variables.css`; the five surfaces and the react/styles split: `CLAUDE.md` → Architecture, `button.css`.
- The issue body is the single source of truth for design + plan (GitHub keeps its edit history); `component-implement` branches from it and ships the PR that closes it. The tracker is shared (`CONTRIBUTING.md`) — every write needs an explicit per-artifact yes, and never touch an issue this session did not create.
