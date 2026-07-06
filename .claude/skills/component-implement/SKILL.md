---
name: component-implement
description: Use to build and ship a base component in @friday-sandbox/react from an approved issue — "implement issue #N for the component", "build and ship the Button", "add a Tooltip", "take the component to a PR", branching from a component issue, or generating a component from its spec. The execution half after component-blueprint; covers running the generator on the spec → filling the residual → gates → PR → the AI-review round. Keywords tailwind-variants, fri-class, stories-as-tests, react-aria, ComponentSpec, component-generator.
---

# Component implement

The execution station for `@friday-sandbox/react` base components: take an approved component issue (a `ComponentSpec` authored by `component-blueprint`) and deliver it — branch → run the generator → fill the residual → gates → PR → hand off the AI-review round. The build itself is now mechanical: `packages/component-generator`'s CLI turns the issue's spec into every generated surface; you fill only what the engine cannot derive — the workspace-level wiring, the hand-authored `<name>.play.ts` interaction test, and prose polish.

```text
approved issue (ComponentSpec, from component-blueprint)
  └→ branch from the issue (<n>-)
       └→ run the generator on the spec (→ tsx, styles.ts, css, stories, mdx, barrels)
            └→ wire the workspace surfaces + fill the residual (play.ts, prose polish)
                 └→ changeset + gates (via hooks) → PR (Closes #<n>) → hand off the AI-review round
```

## When to use

- An approved component issue is ready to build and ship, or a component needs generating, completing a leftover generation, or regenerating from an updated spec.
- Not this station:
  - Primitive, variant model, or spec not settled, or no issue yet → `component-blueprint` first.
  - Bot-review comments after the PR opens → `component-rebut`.

## Steps

The spine is **branch → generate → ship**. The generator detail lives in [Running the generator](#running-the-generator) below; the ship steps wrap it.

1. **Branch from the approved issue.** You are the developer receiving the ticket `component-blueprint` shipped — the issue `#N` the user hands you is your spec; read its body (the embedded `ComponentSpec` source plus the summary) like a real ticket, never a local draft or chat memory. The tracker is shared — work only from an issue the user **explicitly named** this session (a bare invocation with no number → STOP, `gh issue list`, ask which; never auto-select). Run `bash "${CLAUDE_SKILL_DIR}/scripts/preflight.sh"` first; it fails fast with the fix if `gh` is unauthenticated or there's no GitHub remote. Confirm the issue carries `component-blueprint`'s shipped spec; if it doesn't, go back to `component-blueprint`. Confirm it's unclaimed and yours (`gh issue view <n> --json assignees,author`) — an assignee or an in-flight linked branch by another agent → STOP and ask. Then `gh issue develop <n> --checkout`; the branch MUST start `<n>-` (a CI check in `.github/workflows/pr-validate.yml` rejects otherwise, and requires the issue OPEN), off the default branch, one concern. Keep the working tree to that one concern: uncommitted changes from another concern ride along on checkout and — because pre-push gates run whole-repo — can block the push even though they're unstaged; commit or stash them first (`git stash push -- <path>`, pop after), and stage only this change's files.
2. **Run the generator to its contract** on that branch — see [Running the generator](#running-the-generator). Self-check the emitted output, run the scoped story file, then the two-axis sub-agent audit; iterate until the contract holds. If the spec is missing a value you need, or produces the wrong shape, that is a `component-blueprint` gap: loop back through `component-blueprint` and return — never hand-patch the emitted output to route around a spec defect, and never guess a field the spec omits. Cheap while local, costly once the PR is open.
3. **Add exactly one changeset.** Unlike the old `turbo/generators` scaffold, the current engine does not emit a changeset. Run `pnpm changeset` once, covering `@friday-sandbox/react` + `@friday-sandbox/styles` as `minor` (a new component is new public surface); write the summary in `.claude/rules/prose-style.md` voice. A pure fix/complete on an already-shipped component follows the ordinary `feat`/`fix`/`perf`/`refactor` changeset rule instead.
4. **Gates via the hooks.** Pre-commit runs them on staged files; pre-push runs the full gate suite — the list lives in [`CONTRIBUTING.md`](../../../CONTRIBUTING.md). Do not run whole-repo gates by hand; never `--no-verify` or disable a rule — fix the root cause. No completion claim without fresh evidence: the hooks' output is the proof, never "should pass".
5. **Open the PR.** Title is Conventional Commits per [`CONTRIBUTING.md`](../../../CONTRIBUTING.md) — `type(scope): subject`, ≤50 chars, lowercase imperative, no body or footer. Put `Closes #<n>` in the BODY, never the title. Fill the PR template; add a screenshot for visual changes.
6. **Hand off the AI-review round — no CI watch.** Do not run `gh pr checks --watch` or wait for CI here: Chromatic's UI Review/UI Tests rows are human-gated and never resolve on their own, so a bare watch hangs indefinitely. On push, the AI reviewers (CodeRabbit, Gemini) review the diff — **hand off to `component-rebut`** for the bounded triage round; it owns the correct wait pattern (`wait-for-round.sh`) and machine-confirms its own coverage and CI status before the human gate. CI going green, Chromatic, and the merge itself are the human's; never wait on them here.

## Running the generator

The component-specific work of step 2. The engine owns everything derivable; you fill only what it cannot.

1. **Extract the spec and run the generator — never hand-create a component's structure.** Read the issue body `component-blueprint` shipped and copy its fenced `ComponentSpec` source into a local file at `~/.claude/projects/<project>/specs/<name>.spec.ts` (the same convention `component-blueprint` buffers to; recreate it there if this is a fresh session). Type-check it against the spec type first — `pnpm --filter @friday-sandbox/component-generator exec tsc --noEmit <absolute-path-to-spec>` — because schema validation is `tsc` (the type IS the schema) and `node --experimental-strip-types` only strips type annotations, it does not check them; this is the one place a shape error (a wrong field, a missing required key) is caught. Then run the generator from the repo root: `node --experimental-strip-types packages/component-generator/src/cli.ts <spec-path>`. It re-validates semantically (`validate.ts`: the primitive kind is registered, `compound` matches `parts`, every axis `default` is a real member of its axis, every token binding and role/radius-scale axis value resolves to a real `--fri-*` name) and **throws a located error with nothing written** if the spec is incoherent, or writes every emitted file — printing each path to stdout — if it is coherent: `<name>.tsx`, `<name>.styles.ts`, `index.ts`, `<name>.stories.tsx` under `packages/react/src/components/bases/<name>/` (plus `<name>.namespace.ts` for a callable-root compound), `packages/styles/src/components/<name>.css`, and `apps/docs/content/docs/components/<name>.mdx`. Delete the scratch spec file once the run succeeds — it is transient and never committed. A red run here is a spec gap, never a build gap: fix the spec (loop back to `component-blueprint` if the fix isn't yours to make) and rerun; never hand-patch the CLI's output to route around it.
2. **Wire the workspace surfaces the emitter does not yet touch.** The tool emits the component's own files only; it does not add the component to the shared workspace indexes. Add the barrel exports to `packages/react/src/components/bases/index.ts` and `packages/react/src/index.ts` (match the existing entries' shape and alphabetical order), add `@import "./<name>.css";` to `packages/styles/src/components/index.css` (alphabetical, matching its neighbors), and add `<name>` under its `---Category---` group in `apps/docs/content/docs/components/meta.json`. If the spec wraps a `react-aria` part on its own deep subpath, add that subpath to `optimizeDeps.include` in `packages/react/.storybook/main.ts` (addon-vitest reuses that Vite config, so one entry covers both Storybook and Vitest) — an unbundled subpath makes Storybook/Vitest re-optimize mid-run and the import fails.
3. **Fill the residual — two things, never more.**
   - **`<name>.play.ts`** — the per-component keyboard/focus/behavior interaction test, hand-authored beside the generated `<name>.tsx` (stories are the repo's tests; the demo composition is derived from the spec, the interaction assertions are not). Import it into the generated `<name>.stories.tsx` and wire it onto the `Default` story's `play` field — a small hand-edit to a generated file, not a rebuild of its structure. Skip the `userEvent` interaction only for a display/layout base with no interaction (a presence or `getComputedStyle` assertion on `Default` still fits).
   - **Prose polish** — read the emitted `<name>.mdx` against `.claude/rules/prose-style.md`. The prose came from the spec's `prose` field, so this is a read-through for voice and flow in the rendered context, not authoring from scratch.

   Nothing else is residual. A missing variant, a wrong token, an empty demo, or an orphaned class is a spec gap — fix `component-blueprint`'s spec and rerun the generator; hand-patching the emitted `<name>.styles.ts` or `<name>.css` to route around it ships the same defect forward the next time a similar spec is generated.

## Done — the contract

- [ ] Branch starts `<n>-`, off the default branch, one concern; the issue was explicitly named, unclaimed, and yours.
- [ ] The spec ran cleanly through the generator — no hand-patched emitted `<name>.styles.ts` / `.css` / `.stories.tsx` / `.tsx` routing around a spec defect.
- [ ] Every emitted file present at its documented path; the workspace-level wiring (top barrels, styles `index.css` import, docs `meta.json` entry, `optimizeDeps` if applicable) added by hand.
- [ ] `<name>.play.ts` written and wired for an interactive base (or explicitly skipped for a display/layout base); the emitted mdx read against `.claude/rules/prose-style.md`.
- [ ] Exactly one changeset — a fresh `pnpm changeset` run (the generator emits none), covering `@friday-sandbox/react` + `@friday-sandbox/styles` as `minor`.
- [ ] Gates green via the hooks, nothing suppressed. PR title valid Conventional Commits ≤50; `Closes #<n>` in the body; template filled.
- [ ] No `gh pr checks --watch` and no CI wait; the AI-review round handed to `component-rebut` immediately after the PR opens.

## Verify

- **Self-check the emitted output first** by reading `<name>.styles.ts` against `<name>.css` and both against the issue's spec — the mirror is generated in lockstep, but a spec that under-specified a field still surfaces here. Do **not** run `pnpm lint:symmetry` by hand — `CLAUDE.md` reserves it and the other whole-repo gates for the pre-commit/pre-push hooks.
- Self-check each Done box, surface by surface. Self-grading is unreliable, so check against the boxes, not memory.
- Then dispatch the judgment to **two parallel sub-agents, kept un-merged** so one axis can't mask the other — both on **opus** (this is judgment; don't cheap it out), fired in one message:
  - **Spec fidelity** — does the emitted output match the issue's `ComponentSpec` exactly (the right primitive, the exact variant model, every planned token binding, the demo tree), and is there scope-creep (anything in the diff not implied by the spec)?
  - **Residual quality** — is `<name>.play.ts` a real assertion (not vacuous), does the prose read on-voice against `.claude/rules/prose-style.md`, and is the workspace wiring (barrels, styles index, docs nav) actually present?
    Harden the dispatch: never write "do not flag" or "at most Minor" (that pre-judges the auditor); treat the builder's report as unverified claims; grade each finding Critical / Important / Minor. Fix every Critical and Important; re-audit if anything was found. Builder ≠ verifier; never force the same model to retry unchanged.
- Stories are the gate. Verify with the scoped single-file run `pnpm --filter @friday-sandbox/react exec vitest run <name>` (blessed in `CLAUDE.md` Commands, not a whole-repo gate), so a broken `play` or a vacuous assertion surfaces here, not at CI. Let the hooks run the full suite.
- Confirm the branch matches `^<n>-`, the title parses as `type(scope): subject` within 50 chars, and exactly one changeset covers the change. Do not claim green from memory — the hooks' output is the evidence.
- A gate red? Diagnose the root cause before patching — see [`references/DIAGNOSING.md`](references/DIAGNOSING.md).

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Issue  | Branch       | Component | Variants                     | Gates          | PR                      |
| ------ | ------------ | --------- | ---------------------------- | -------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<name>`  | `<roles>×<variants>×<sizes>` | pass via hooks | `#<pr>` (`Closes #<n>`) |

## Red flags — STOP

- About to act on an issue the user did not EXPLICITLY name, or matched by title/topic resemblance → STOP; ask for the `#N`, confirm it's unclaimed and yours.
- About to `gh issue develop`, branch, push, or PR without an explicit per-artifact yes, or on an artifact this session didn't create → STOP; authorship is not ownership.
- Hand-patched a wrong mapping in the emitted `<name>.styles.ts`/`.css`/`.stories.tsx` instead of fixing the spec and rerunning the generator → the defect ships forward unfixed the next time a similar spec is generated.
- Authored a spec inline instead of extracting the one the issue carries, or proceeded after the generator threw a validation error → STOP; a red run means the spec has a gap, never a build workaround.
- Left the workspace-level wiring (barrels, styles `index.css`, docs `meta.json`, `optimizeDeps`) undone → an unreachable, unstyled, or undocumented component.
- Added a second changeset, or none at all → the generator emits none now; exactly one `pnpm changeset` is required.
- Invented a prop, variant, axis, or demo node not in the issue's spec → STOP; the spec is the issue (from `component-blueprint`), never guessed here. A gap in the spec is a blueprint gap — resolve it there, don't fill it in here.
- `--no-verify`, disabling a rule, or "I'll fix the gate later" → forbidden; fix the cause. `Closes #n` in the title, or a subject over 50 chars or capitalized → invalid.
- Running `gh pr checks --watch`, or otherwise waiting for CI/Chromatic to go green before handing to `component-rebut` → STOP; that step is deleted (Chromatic's human-gated rows never resolve on their own). CI, Chromatic, and merge are the human's.
- Committing the scratch spec file, or leaving it behind after a successful run → STOP; it is transient and never enters the repo.

## What this encodes

- The react/styles split linked by `fri-<name>`, the `--fri-*` token ladder, and the `@layer theme, base, components, utilities` cascade (`packages/styles/src/index.css`). Reference: `button` + `button.css`.
- The generator: `packages/component-generator` (`src/cli.ts` is what this skill invokes; `src/emit/` is the spec → `{ tsx, styles.ts, css, stories, mdx, index.ts, namespace.ts }` pipeline; `src/validate.ts` is what throws before anything is written). It owns the entire symmetric scaffold; you fill only the two residuals in [Running the generator](#running-the-generator).
- Workflow, commit, changeset, and gate rules: `CONTRIBUTING.md`. Operating rules and the `src` ↔ `exports` invariant: `CLAUDE.md`. Tests-are-stories: `packages/react/vitest.config.ts` with `storybook/test`.
- Determinism = symmetry + fewer tokens: a defect in a generated surface is a spec defect, never a hand-authoring defect — fix `component-blueprint`'s spec, never free-hand the generated file.
- The tracker is shared (`CONTRIBUTING.md`: claim before you start; one issue, one PR). Chromatic (`CHROMATIC_PROJECT_TOKEN`) can show red when its secret isn't configured (`.github/workflows/chromatic.yml`); whether a check blocks merge is branch-protection config — that verdict, and CI's, is `component-rebut`'s to confirm before the human gate, never this skill's.
