---
name: component-rebut
description: Use after opening or pushing a base-component PR in @friday-sandbox/react that AI code-review bots (CodeRabbit, Gemini Code Assist) or humans have commented, and the component PR's threads need triaging before merge. Triggers "handle the coderabbit comments on the component PR", "go through the bot review on the component", "rebut the reviewer on the component PR". Not for docs, config, tooling, or other non-component PRs.
---

# Component rebut

The AI-review triage station: drive each round of review to clean **autonomously** — decide every finding yourself (fix it, or rebut it with a reason), answer every thread on the PR, fix in one batch, and push once, repeating per round — then hand to the human's final gate. You never bring a finding to the chat to adjudicate: the conversation with reviewers happens **in the PR threads**, where the human reads it. The human enters only at the end, once the AI reviewers stop requesting changes.

## When to use

- An open component PR you're working on has, or is about to get, bot or human review comments.
- Not this station:
  - Building or shipping the component (generate, fill surfaces, branch, gates, PR) → `component-implement`.
  - The component's shape, ladder, or plan not settled → `component-blueprint`.

## Steps

1. **Wait for the WHOLE round — by machine, then gather.** Both CodeRabbit and Gemini Code Assist auto-review every PR (`.coderabbit.yaml`, `.gemini/config.yaml`). Block on `bash "${CLAUDE_SKILL_DIR}/scripts/wait-for-round.sh" <pr>` — it polls the real completion signals (CodeRabbit has finalized at the current head — a review submitted at the head SHA, even an empty acknowledge-only one, or its "Actionable comments posted" marker — with the walkthrough's "Currently processing" note absent; Gemini has a review submitted at the current head, so a round-1 review can't satisfy round 2) on a bounded cadence (20s→45s, cap 600s via `WAIT_ROUND_TIMEOUT`) and exits when the round is complete or at the cap. **Never hand-roll a poll loop, and never match a bot login by exact string** — GraphQL `author.login` is `gemini-code-assist` while REST `user.login` is `gemini-code-assist[bot]`; the script owns that matching. The bots' placeholder posts ("review in progress", "will post my feedback shortly") are not the round. On a partial timeout (exit 4), proceed with the posted findings and name the absent reviewer in the round-summary comment. Then pull the real findings with `bash "${CLAUDE_SKILL_DIR}/scripts/gather-review.sh" <pr>` (round status + every review summary + every inline comment + the bots' PR comments) so you triage what exists, never fabricate or drop one; collect any human comments too.
2. **Batch and triage — verify before you file.** Triage every comment from every reviewer at once: real defect, nit, or wrong. A finding is real only if it survives VERIFY against this codebase — bots emit false positives; one asking to add a `size` we deliberately omitted fails (grep stories/docs first), as does one that would break the `fri-` class contract or the `src ↔ exports` invariant. Check `.review-decisions/` for a finding already rejected in a prior round and surface that rebuttal instead of re-arguing. No performative agreement, no reflexive dismissal. You adjudicate every finding yourself — bot right → fix, bot wrong → rebut — and never escalate one to the chat for the user to decide. **Fan out the verification** so a big round doesn't verify serially: dispatch one sub-agent per finding in a **single message** to grep this codebase and return a verdict + evidence, defaulting to "refuted" when nothing in the tree supports it. They gather evidence only — you still adjudicate every finding on the main thread (fix or rebut) and write every reply. Size each to the task: **sonnet** for this grep-verify, **haiku** for a lone single-pattern check, **opus** only for a genuinely ambiguous call where being wrong is costly.
3. **A sub-issue only for work you will NOT fix in this PR.** A finding you fix now — every style-guide nit, every quick correctness fix — needs no sub-issue: the PR thread reply plus the fix commit are the trace. Open a sub-issue (linked to the parent) only for a real finding you are deferring or that is cross-cutting; the `component-implement` entry-authorization already covers it, so don't open a fresh chat prompt per finding. Write a deferred sub-issue behaviorally — current vs desired, a testable acceptance criterion, and an out-of-scope line so the fix isn't gold-plated — referencing interfaces by type, not a file path that goes stale.
4. **Fix all on the same branch, then push ONCE** for the whole batch. Never push per comment — each push re-triggers the bots, so one push per round prevents re-review thrash.
5. **Close any sub-issues through the PR.** For each sub-issue you opened, add `Closes #<sub>` to the PR body, so merging the PR closes it and the flow is recorded.
6. **Reply to EVERY thread**, in the thread (`gh api repos/<owner>/<repo>/pulls/<pr>/comments/<id>/replies`, not a top-level PR comment): fixed (name the commit, or the sub-issue if deferred) or rebutted with a concrete reason. **Every automated write opens with the disclosure blockquote** — `> 🤖 Automated triage by Claude Code, posted through the maintainer's account, not a personal review.` — as its first line (replies AND summary comments); posting through the maintainer's login without it reads as a human review and misleads everyone on the PR. Every thread gets a reply — that is how the human sees, on the PR, that each point was handled. Record a rebuttal to `.review-decisions/<concept>.md` so the same false positive isn't re-argued next round; keep that directory **gitignored and local** — committing it on its own triggers another bot round, so never push it alone (fold it into the next round's batch only if you choose to track it).
7. **Post the round summary on the PR.** After the thread replies, post ONE top-level comment (`gh pr comment <pr> --body-file …`), opening with the same disclosure blockquote: the round number, what was fixed (each with the commit sha), what was rebutted (one-line reason each), and any reviewer that never posted. The Brief lives **on the PR**, not in the chat — the human must see the round's outcome at a glance without excavating threads.
8. **Repeat per round — bounded.** The batched push re-runs the bots → back to step 1 (`wait-for-round.sh` again; a reviewer with nothing new to say doesn't re-post, and the script doesn't wait for silence — CodeRabbit's summary flipping back to "processing" is the re-review signal). Continue until a full round returns no real findings. Total wall-clock is minutes, not hours: the wait is bounded, verification fans out in one message, fixes land in one push.
9. **Hand to the human checkpoint.** Confirm the round is clean by machine, not by eye: `bash "${CLAUDE_SKILL_DIR}/scripts/verify-coverage.sh" <pr>` must report `answered N / N` (every bot finding has a reply) and `bash "${CLAUDE_SKILL_DIR}/scripts/ci-status.sh" <pr>` must read `ci: green` (the verdict covers every **reported check minus the known secret-/human-gated set** — pkg-pr-new, Chromatic's UI Review/Tests, Sonar are split out as informational and don't block; merge protection itself stays GitHub's). Then hand the human the link to the round-summary comment (step 7) for their final review on the PR (the merge gate). The human reads the threads and merges; you never merge. If the human requests changes, they re-enter here as a new round.

## Done — the contract

- [ ] Waited for the full async round via `wait-for-round.sh` (bounded, signal-based) — not the first bot, not a placeholder post, and never a hand-rolled poll.
- [ ] Every real finding fixed or rebutted; sub-issues only for deferred or cross-PR work, each with `Closes #<sub>` in the PR body.
- [ ] Fixes batched into ONE push per round; no per-comment pushes.
- [ ] Each thread answered on the PR — fixed or rebutted with a reason, decided in-loop and never escalated to the chat; no performative agreement.
- [ ] One top-level round-summary comment posted per round — fixed (with sha) + rebutted (with reason) at a glance — in addition to the per-thread replies.
- [ ] Every automated write (reply and summary) opens with the `> 🤖 Automated triage by Claude Code…` disclosure blockquote.
- [ ] Looped until the AI round was machine-confirmed clean (`verify-coverage` N/N + `ci-status` green on required checks), then handed to the human's gate; never merged without the human.

## Verify

- Machine-confirm the round, don't declare it clean by eye: `"${CLAUDE_SKILL_DIR}/scripts/verify-coverage.sh" <pr>` reads `answered N / N` and `"${CLAUDE_SKILL_DIR}/scripts/ci-status.sh" <pr>` reads `ci: green` (required scope).
- The round-summary comment is on the PR (step 7) and matches the threads — every fixed item names its sha, every rebuttal its reason.
- Exactly one push carried the round's whole batch; no extra push re-triggered the bots mid-round.
- Any sub-issue you opened is linked to the parent and carries `Closes #<sub>` in the PR body.

## Closing summary table

On finishing, report one markdown table — the result at a glance, one row per round:

| Round | PR      | Findings              | Fixed                 | Pushed             |
| ----- | ------- | --------------------- | --------------------- | ------------------ |
| `<k>` | `#<pr>` | `<real>` after verify | `<closed>` sub-issues | `<sha>` (one push) |

## Red flags — STOP

- Reacting to one bot before the other configured reviewers' rounds land → wait for all of them, then batch.
- Hand-rolling a poll loop, or matching a bot login by exact string → REST logins carry the `[bot]` suffix GraphQL omits; a mismatched poll waits forever on a review that already landed. `wait-for-round.sh` owns the detection.
- Treating a bot's "review in progress" / "will post shortly" placeholder as its review → the round isn't complete; the wait script knows the real signals.
- Finishing a round with per-thread replies but no top-level summary comment → the human can't see the outcome at a glance; post the round summary (step 7).
- An automated reply or summary without the leading `> 🤖 Automated triage…` disclosure → it posts under the maintainer's login and reads as a human review; every automated write carries the blockquote first.
- Bulk-editing posted comments without reading each body back first → a wrong GET endpoint returns empty and the PATCH wipes the thread (the single review comment lives at `pulls/comments/<id>`, no PR number in the path).
- Pushing per comment → re-renders the AI review every push; batch into one push per round.
- Opening a sub-issue for a nit you just fixed → over-ceremony; the thread reply and the fix commit are the trace. Sub-issues are for deferred or cross-PR work only.
- Bringing a finding to the chat for the user to adjudicate → the review loop is autonomous; decide it yourself and answer the thread on the PR.
- Opening a new PR for fixes → same branch and PR; the PR closes the sub-issues.
- Merging yourself → the merge is the human's call.
- Agreeing or dismissing without verifying against the code → verify first.

## What this encodes

- Address review by pushing follow-up commits to the same branch (`CONTRIBUTING.md`); here, batched once per round.
- The configured AI reviewers are `.coderabbit.yaml` and `.gemini/config.yaml` (Gemini's review rules live in `.gemini/styleguide.md`). Sub-issues are created after confirming with the user, linked to the parent and closed by the PR; the tracker is shared (`CONTRIBUTING.md`) — confirm before creating and don't touch others' work (see `component-implement`).
- Chromatic (`CHROMATIC_PROJECT_TOKEN`) can show red when its secret isn't configured (`.github/workflows/chromatic.yml`); whether any check blocks merge is branch-protection config — `ci-status.sh` verdicts over every reported check minus the known secret-/human-gated set (pkg-pr-new, Chromatic UI Review/Tests, Sonar — an explicit allowlist, so a renamed check falls back to blocking, the safe direction), and `gh pr checks --required` is not trusted for the verdict because it omits required checks that haven't reported yet.
- Bot identity differs by API surface — GraphQL `author.login` omits the `[bot]` suffix REST `user.login` carries — and both bots post placeholders before the real round; `wait-for-round.sh` is the single home for that detection (CodeRabbit finalizes by editing its summary comment to "Actionable comments posted"; a re-review flips it back to "Currently processing").
