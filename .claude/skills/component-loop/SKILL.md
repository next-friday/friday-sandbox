---
name: component-loop
description: Use when a whole base component should be driven end to end from one goal, rather than prompting each step by hand. Triggers "build a Tooltip end to end", "take X to a PR", "do the whole component", or when you keep re-prompting now-do-stories / now-ship / now-fix-the-review.
---

# Component loop

The loop that removes per-step prompting. From one goal it drives nested loops — an inner build↔verify loop that closes on the build contract, then an outer ship→AI-review→fix loop that closes when every AI reviewer is clean — re-reading the goal and a disk state file each pass. The human is first and last: a detailed plan up front, then the final merge gate once the AI reviewers stop requesting changes. Everything between runs autonomously, and a human rejection re-enters the loop.

## When to use

- One trigger for an entire component through to merge, rather than driving each station by hand.
- Symptom: you keep re-prompting "now do the stories", "now ship", "now fix the review" — that sequencing is the loop's job.
- Not this station:
  - A single station in isolation → call `component-design`, `component-build`, `component-ship`, or `component-review` directly.

## Steps

1. **Human plans in detail and authorizes (touchpoint 1).** The human writes the detailed goal and, for the shared tracker, authorizes this one component's pipeline up front: the parent issue, its single PR, and any deferred sub-issues the review loop may open. Write the goal and a station checklist to a disk state file you re-read each pass; the state file, not memory, survives a context reset. No authorization → pause before the first GitHub create and ask. The state file is a fixed checklist, so every run's spine reads the same:

   ```text
   # <component> — loop state

   Goal: <one line> · Authorized: issue #_, PR #_, review sub-issues

   - [ ] design
   - [ ] build — 5 surfaces filled
   - [ ] verify — mirror self-checked, sub-agent audit clean, scoped stories green
   - [ ] ship — branch <n>-, changeset, gates, PR (Closes #parent)
   - [ ] review — every bot round N/N clean
   - [ ] human merge
   ```

2. **Inner loop — build to clean (autonomous).** Run the stations as one pass: `component-design` (only if the shape is unsettled) → `component-build` (generate → swap the primitive → fill the ladder → mirror the css → stories). Then **verify**: self-check the variants↔css mirror by reading them (the pre-commit hook runs `lint:symmetry` — don't run it by hand), run the scoped story file (`pnpm --filter @friday-sandbox/react exec vitest run <name>`), self-check `component-build`'s Done contract, then dispatch the two-axis sub-agent audit (Standards | Spec, kept un-merged, verifier ≠ builder — see `component-build` Verify) for the judgment the script can't check. Findings → repeat the pass. Exit only when the script is clean AND the contract holds AND the audit is clean — never on a half-pass.

3. **Ship once.** Create the authorized issue if it does not exist yet (`gh issue create`), then run `component-ship`: branch `<n>-`, verified changeset, gates green via hooks, PR with `Closes #<n>`.

4. **Outer loop — review to clean (autonomous).** → `component-review`: wait for the full AI round (CodeRabbit, Gemini) plus any human comments, then decide every finding yourself (fix or rebut), fix on the same branch, answer every PR thread, and push ONCE — one push per round prevents re-review thrash. Sub-issues only for deferred work, closed by the PR (`Closes #<sub>`). The push re-runs the bots → repeat until a round returns no real findings. No human in this loop — the conversation with reviewers stays in the PR threads, never the chat.

5. **Human checkpoint — the sole merge authority (touchpoint 2, first and last).** The checkpoint is _pushed right_: it opens only after the loop has done all it can autonomously — build, verify, and drive every AI reviewer clean. The loop then hands the human a **Brief** — a decision-ready summary: what was built (component + surfaces), what each AI reviewer flagged and how it was fixed (the closed sub-issues), and anything left to decide — so the human decides from the Brief, not by digging. Correct → the human merges and the loop closes. Not correct → the requested changes re-enter the loop (back to step 2): fix → re-verify → drive the AI reviewers clean again → a fresh Brief → the human reviews again. Merge happens only on the human's approval; an AI-clean round opens the checkpoint, it never merges on its own.

6. **State every pass; keep dispatches lean.** Update the state file after each station; on a context reset, resume from disk, not memory. Dispatch sub-agents with file paths, not pasted text — have them write the report to a file and return status + path — and set the model per role: a cheap tier for mechanical fills, a capable tier for the final audit. Keep design + build in one window; near the context limit, write the state file and hand off to a fresh session rather than compact mid-build.

## Done — the contract

- [ ] The human had two stages only: the detailed plan up front (authorizing issue + PR + review sub-issues), and the final merge gate (which repeats on rejection).
- [ ] Inner loop repeated stations → verify until the build Done contract held and the audit was clean.
- [ ] PR opened once; review fixes pushed to the SAME PR, batched one push per round.
- [ ] Every review finding fixed or rebutted with a PR-thread reply; sub-issues only for deferred work, linked to the parent and closed by the PR.
- [ ] The human gate opened only after every AI reviewer was clean; merge happened only on the human's approval, and a rejection re-entered the loop.
- [ ] A disk state file drove the run and survived any context reset.

## Verify

- The inner stopping condition is the build Done contract plus a clean independent audit — not "it looks done".
- The outer stopping condition is a review round with no real findings, reached by batched one-push rounds.
- Confirm the human acted only at plan and merge, no second PR was opened, and no GitHub create happened without authorization.

## Closing summary table

On finishing, report one markdown table — the result at a glance:

| Issue  | Branch       | Commit              | Gates          | PR                      |
| ------ | ------------ | ------------------- | -------------- | ----------------------- |
| `#<n>` | `<n>-<slug>` | `<sha>` `<subject>` | pass via hooks | `#<pr>` (`Closes #<n>`) |

## Red flags — STOP

- Hand-prompting each station in turn → set the goal once; the loops drive them.
- Putting the human inside the autonomous AI round → the human reviews only at the gate, after every AI reviewer is clean; the loop auto-fixes AI findings via sub-issues.
- Merging on an AI-clean round alone, or without the human's explicit approval → AI-clean only opens the human gate; merge is the human's call.
- Treating a human rejection as the end → it re-enters the loop (fix → verify → AI-clean → human re-review) until the human approves.
- Exiting the inner loop on a failed audit → not clean; repeat the pass.
- Per-comment pushes, or reacting before all bots land → wait the full round, batch, push once.
- Opening a NEW PR for fixes → same branch/PR. (A nit fixed in-round needs no sub-issue; the thread reply and commit are the trace — sub-issues are for deferred work only.)
- A GitHub create without the plan's up-front authorization → pause and ask (shared tracker).
- Trusting memory across a context reset → read the state file.

## What this encodes

- Nested loops: the inner (stations → verify) closes on the build Done contract; the outer (ship → AI-review → back to inner) closes when every AI reviewer is clean; then the human gate decides. The four `component-*` stations run inside them.
- The human is first (the detailed plan and authorization) and last (the merge gate); the gate opens only after the AI reviewers are clean and is the sole merge authority — a rejection loops back through fix → verify → AI-clean → human re-review. The autonomous spans are inner-build and the batched AI review-fix. One issue, one PR, with deferred-only sub-issues closed by the PR — `component-ship` and `component-review` hold the shared-tracker rule.
- Parallel or isolated builds: a git worktree, its branch named `<n>-…` (the CI gate), one component per tree.

## Running unattended (heartbeat)

Optional, and needs an **external scheduler** — your harness's cron / `/goal`, not provided by this repo. To run the loop on a cadence that advances each authorized pipeline to its human gate (and never past it), see [`references/HEARTBEAT.md`](references/HEARTBEAT.md).
