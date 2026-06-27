---
name: component-review
description: Use after opening or pushing to a pull request that AI code-review bots (CodeRabbit, Gemini Code Assist) or humans have commented and the threads need triaging before merge. Triggers "handle the coderabbit comments", "go through the bot review", "respond to the reviewer", "the PR has review comments".
---

# Component review

The review station: drive a whole round of AI review on the PR to clean — turn every finding into a tracked sub-issue, fix them in one batch, and push once, repeating per round — then hand to the human's final gate. The human reviews only once the AI reviewers stop requesting changes.

## When to use

- An open PR you're working on has, or is about to get, bot or human review comments.
- Not this station:
  - Building or fixing the component in isolation → `component-build`.
  - Branch, changeset, PR mechanics → `component-ship`.

## Steps

1. **Wait for the WHOLE round, then gather.** Both CodeRabbit and Gemini Code Assist auto-review every PR (`.coderabbit.yaml`, `.gemini/config.yaml`); let every configured reviewer post, and collect any human comments too, before acting — don't react to the first reviewer to respond. Pull the real findings with `bash "${CLAUDE_SKILL_DIR}/scripts/gather-review.sh" <pr>` (every review summary + every inline comment) so you triage what exists, never fabricate or drop one.
2. **Batch and triage — verify before you file.** Triage every comment from every reviewer at once: real defect, nit, or wrong. A finding is real only if it survives VERIFY against this codebase — bots emit false positives; one asking to add a `size` we deliberately omitted fails (grep stories/docs first), as does one that would break the `fri-` class contract or the `src ↔ exports` invariant. Check `.review-decisions/` for a finding already rejected in a prior round and surface that rebuttal instead of re-arguing. No performative agreement, no reflexive dismissal.
3. **Open a sub-issue per real finding** — one that survived VERIFY — (group trivial related nits), each linked to the parent issue, after confirming with the user — the tracker is shared, so never create an unowned or foreign artifact. Every real problem becomes an issue; that is the traceable flow. Write each sub-issue behaviorally — current vs desired, a testable acceptance criterion, and an out-of-scope line so the fix isn't gold-plated — referencing interfaces by type, not a file path that goes stale.
4. **Fix all on the same branch, then push ONCE** for the whole batch. Never push per comment — each push re-triggers the bots, so one push per round prevents re-review thrash.
5. **Close the sub-issues through the PR.** Add `Closes #<sub>` for each fixed sub-issue to the PR body, so merging the PR closes them and the flow is recorded.
6. **Reply** to each thread, in the thread (`gh api .../pulls/comments/<id>/replies`, not a top-level PR comment, so it resolves): fixed (naming its sub-issue) or rebutted with a reason. Record a rebutted finding to `.review-decisions/<concept>.md` so the same false positive isn't re-argued next round.
7. **Repeat per round.** The batched push re-runs the bots → back to step 1. Continue until a full round returns no real findings.
8. **Hand to the human checkpoint.** Confirm the round is clean by machine, not by eye: `bash "${CLAUDE_SKILL_DIR}/scripts/verify-coverage.sh" <pr>` must report `answered N / N` (every bot finding has a reply) and `bash "${CLAUDE_SKILL_DIR}/scripts/ci-status.sh" <pr>` must read `ci: green`. Then hand the human a **Brief** — what each reviewer flagged and how it was fixed (the closed sub-issues) — for their final review (the loop's merge gate). Do not merge yourself. If the human requests changes, they re-enter here as a new round.

## Done — the contract

- [ ] Waited for the full async round (every configured bot + human) before acting, not the first bot.
- [ ] Every real finding became a sub-issue linked to the parent, fixed, with `Closes #<sub>` in the PR body.
- [ ] Fixes batched into ONE push per round; no per-comment pushes.
- [ ] Each thread answered — fixed or rebutted with a reason; no performative agreement.
- [ ] Looped until the AI round was machine-confirmed clean (`verify-coverage` N/N + `ci-status` green), then handed to the human's gate; never merged without the human.

## Verify

- Machine-confirm the round, don't declare it clean by eye: `"${CLAUDE_SKILL_DIR}/scripts/verify-coverage.sh" <pr>` reads `answered N / N` and `"${CLAUDE_SKILL_DIR}/scripts/ci-status.sh" <pr>` reads `ci: green`.
- Exactly one push carried the round's whole batch; no extra push re-triggered the bots mid-round.
- Each sub-issue is linked to the parent and carries `Closes #<sub>` in the PR body.

## Red flags — STOP

- Reacting to one bot before the other configured reviewers' rounds land → wait for all of them, then batch.
- Pushing per comment → re-renders the AI review every push; batch into one push per round.
- Fixing a finding without a sub-issue → breaks the traceable flow; every real problem is an issue.
- Opening a new PR for fixes → same branch and PR; the PR closes the sub-issues.
- Merging yourself → the merge is the human's call.
- Agreeing or dismissing without verifying against the code → verify first.

## What this encodes

- Address review by pushing follow-up commits to the same branch (`CONTRIBUTING.md`); here, batched once per round.
- The configured AI reviewers are `.coderabbit.yaml` and `.gemini/styleguide.md`. Sub-issues are created after confirming with the user, linked to the parent and closed by the PR; the tracker is shared (`CONTRIBUTING.md`) — confirm before creating and don't touch others' work (see `component-ship`).
- Chromatic (`CHROMATIC_PROJECT_TOKEN`) can show red when its secret isn't configured (`.github/workflows/chromatic.yml`); whether any check blocks merge is branch-protection config — confirm via the PR's checks, don't assume.
