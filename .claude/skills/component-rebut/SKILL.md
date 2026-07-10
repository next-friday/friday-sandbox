---
name: component-rebut
description: Use after opening or pushing a base-component PR in @friday-sandbox/react (or a pipeline PR carrying component changes) that AI code-review bots (CodeRabbit, Gemini Code Assist) or humans have commented, and the PR's threads need triaging before merge. Triggers "handle the coderabbit comments on the component PR", "go through the bot review on the component", "rebut the reviewer on the component PR". Not for a PR with no component surface in it.
---

# Component rebut

## Purpose

Drive each round of AI review on a component PR to clean autonomously — decide every finding (fix it, or rebut it with a reason), answer every thread on the PR, batch fixes into one push per round — then hand the human their final merge gate. The review-triage half after `component-implement`.

## Input

- An open component PR carrying AI code-review comments (CodeRabbit, Gemini) to triage.

## Tasks

1. **Wait for the whole round, then gather.** Both CodeRabbit and Gemini Code Assist auto-review every PR (`.coderabbit.yaml`, `.gemini/config.yaml`; Gemini's rules in `.gemini/styleguide.md`). Block on `bash "${CLAUDE_SKILL_DIR}/scripts/wait-for-round.sh" <pr>` — it polls the real completion signals on a bounded cadence (20s→45s, cap 600s via `WAIT_ROUND_TIMEOUT`) and exits when the round completes or at the cap. A placeholder post ("review in progress", "will post my feedback shortly") is not the round. On a partial timeout (exit 4), proceed with the posted findings and name the absent reviewer in the round-summary comment. On a rate limit (exit 5 — the bot posted "Review limit reached"): the reviewer will NOT arrive this window, so close the round with the posted findings, name the rate-limited reviewer and its reset time in the summary, and re-trigger later with a `@coderabbitai review` comment — only after confirming the PR is still OPEN (`gh pr view <pr> --json state`), only ONCE, and only after the reset time the bot's own comment states ("Next review available in: N minutes" — read it, never guess a sleep); never post a trigger or leave a scheduled watcher running against a merged or closed PR. **A trigger acknowledgment is not a review**: CodeRabbit replies "Review finished" to the command even while still rate-limited, then posts a fresh rate-limit reply. The only proof a review ran for the current head is a review object or an "Actionable comments posted: N" marker for that sha — absent that, the reviewer has not reviewed, whatever the acknowledgment says. Every push, PR open, and trigger spends the same per-developer review quota: batch work into the fewest pushes, hold a small follow-up for the next natural round, and expect parallel PRs to starve each other into this limit. On a settled round (exit 6 — every reviewer holds only a prior-round review or a rate limit, none is coming for the pushed head): a bot that declines to re-review a fix push is not a blocker — confirm `verify-coverage.sh` reads `answered N / N`, then the round is settled and closes. Then pull findings with `bash "${CLAUDE_SKILL_DIR}/scripts/gather-review.sh" <pr>` (round status + every review summary + every inline comment + the bots' PR comments, ending with the answered/MISSING coverage state per top-level thread — triage only the MISSING ones in a later round); collect any human comments too.
2. **Batch and triage — verify before you file.** Triage every comment from every reviewer at once: real defect, nit, or wrong. A finding is real only if it survives VERIFY against this codebase — one asking to add a `size` we deliberately omitted fails (grep stories/docs first), as does one that would break the `fri-` class contract or the `src ↔ exports` invariant. A **dependency or toolchain finding** (version compatibility, peer ranges, "this breaks under X") is never rebutted on the current `node_modules` — a stale install turns every local gate into a false green; the only admissible evidence is a lockfile-faithful state (`pnpm dedupe` + reinstall, a fresh clone, or the CI log itself) plus the registry's published peer ranges. Check `.review-decisions/` for a finding already rejected in a prior round and surface that rebuttal. Adjudicate every finding yourself — bot right → fix, bot wrong → rebut. Fan out the verification: dispatch one sub-agent per finding in a single message to grep this codebase and return a verdict + evidence, defaulting to "refuted" when nothing in the tree supports it — they gather evidence only; you adjudicate and write every reply on the main thread. Size each: **sonnet** for the grep-verify, **haiku** for a lone single-pattern check, **opus** only for a genuinely ambiguous, costly call.
3. **Sub-issue only for work you will NOT fix in this PR.** A finding you fix now needs no sub-issue — the PR thread reply plus the fix commit are the trace. Open a sub-issue (linked to the parent, confirmed with the user first — the tracker is shared) only for a real finding you defer or that is cross-cutting. Write it behaviorally — current vs desired, a testable acceptance criterion, an out-of-scope line — referencing interfaces by type, not a file path.
4. **Fix all on the same branch, then push once** for the whole batch. Never push per comment. **Pre-flight the push**: run `round-state.sh` immediately before it — a `MISSING` thread means a review landed after the round closed (a rate-limit close does not stop a late review from arriving) and re-opens triage; never push over an unanswered thread.
5. **Close any sub-issues through the PR.** For each sub-issue you opened, add `Closes #<sub>` to the PR body.
6. **Reply to every thread**, in the thread (`gh api repos/<owner>/<repo>/pulls/<pr>/comments/<id>/replies`, not a top-level PR comment): fixed (name the commit, or the sub-issue if deferred) or rebutted with a concrete reason. Open every automated write with the disclosure blockquote `> 🤖 Automated triage by Claude Code, posted through the maintainer's account, not a personal review.` as its first line (replies and summary comments). Record a rebuttal to `.review-decisions/<concept>.md`; keep that directory gitignored and local — never push it alone (fold into the next round's batch only if you choose to track it).
7. **Post the round summary on the PR — the reviewers' own shape: a bold tally line, grouped bullets, everything secondary collapsed. No tables, no headings, no emoji outside `<summary>` lines.** After the thread replies, post one top-level comment (`gh pr comment <pr> --body-file …`) in this exact shape:
   - the disclosure blockquote, then the bold one-line tally `**Review round <k> — fixed: <n>, rebutted: <m>**`;
   - a `Fixed in <bare sha>:` list (GitHub autolinks the sha), one bullet per finding — file, then what changed, one line; then a `Rebutted:` list, one bullet per finding with its one-line reason; a deferral bullet names its sub-issue `#<sub>`;
   - `---`, then a `<details><summary>ℹ️ Round info</summary>` block holding the head sha, the fix sha, and one line per expected reviewer — including any that never posted, was rate-limited (with its reset time), or declined the head.
   - **Every round posts its summary — zero-finding, rate-limited, and settled rounds included.** The PR is where teammates read the round's state; a chat report reaches no one. The body's last visible line is the bold merge-readiness state: `**State: ready for the human merge gate**` or `**State: waiting on <reviewer> — not ready to merge**`.
8. **Repeat per round — bounded.** The batched push re-runs the bots → back to step 1 (`wait-for-round.sh` again). Continue until a full round returns no real findings.
9. **Hand to the human checkpoint.** Confirm the round is clean by machine: `bash "${CLAUDE_SKILL_DIR}/scripts/round-state.sh" <pr>` must read `next handoff` — it folds in `verify-coverage.sh` (`answered N / N`), the settled per-reviewer states, and the posted step-7 summary. Hand the human the link to that round-summary comment for their final review — the merge gate. CI, checks, and re-runs are outside this skill: branch protection blocks a red merge and the human reads the checks tab. The human reads the threads and merges; you never merge. A requested change re-enters here as a new round.

## Rules

- Wait for the full async round via `wait-for-round.sh` before reacting — never the first bot alone, never a placeholder post, never a hand-rolled poll loop. Never match a bot login by exact string: GraphQL `author.login` is `gemini-code-assist`, REST `user.login` is `gemini-code-assist[bot]`; the script owns the matching.
- **Read round state only through `round-state.sh <pr>`** — one line per reviewer (reviewed-clean / reviewed-findings / rate-limited / abstained / prior-round / absent), measured against the newest non-merge commit, review-object evidence first. Never improvise a `gh api` grep for "is the bot done": a hand grep reads a stale rate-limit marker as current, an acknowledgment as a review, or a base-update merge commit as unreviewed content — every one of those misreads has shipped a false status.
- Verify every finding against this codebase before filing — no performative agreement, no reflexive dismissal. A finding that asks for the OLD contract (a per-state story, a `Colors` showcase, a 3-column Props table) is rebutted by pointing at [`.claude/rules/stories-docs-sync.md`](../../rules/stories-docs-sync.md) and the gate.
- Adjudicate every finding yourself (fix, or rebut with a reason); never escalate one to the chat for the user to decide.
- Answer every thread on the PR — fixed (with sha or sub-issue) or rebutted with a reason.
- Open every automated write (reply and summary) with the `> 🤖 Automated triage by Claude Code…` disclosure blockquote as its first line.
- Batch fixes into one push per round; never push per comment; never open a new PR for fixes — same branch and PR.
- Open a sub-issue only for deferred or cross-PR work, never for a nit you just fixed; confirm with the user before opening one, and never touch work this session didn't create — the tracker is shared. Link each to the parent and carry `Closes #<sub>` in the PR body.
- Post exactly one top-level round-summary comment per round, in addition to the per-thread replies; its body is the step-7 shape, never prose paragraphs.
- Never bulk-edit a posted comment without reading its body back first — the single review comment lives at `pulls/comments/<id>` (no PR number in the path); a wrong GET returns empty and the PATCH wipes the thread.
- Keep `.review-decisions/` gitignored and local; never push it alone.
- A PR replaced mid-round (a head-branch rename closes its PR permanently — GitHub does not retarget; a recreate) continues on the successor: its body opens with `Supersedes #<old>` naming where the earlier threads live, `.review-decisions/` carries the adjudications across, an already-answered finding that reappears is answered from that record, and only genuinely new threads get fresh triage. Never rename a branch while its PR is open — rename first, then open the PR.
- Loop until the AI round is machine-confirmed clean (`verify-coverage` N/N + the round summary posted), then hand to the human's gate; never merge yourself.
- **One PR in flight.** While this session has an open PR, never open the next issue, branch, or PR — prepare the next change locally and queue it; only an explicit "open it now, don't wait" from the user overrides. A parallel PR taxes the team twice: a stale base after the first merge forces a branch update and a full CI re-run.
- **A stale base is yours to update.** When a merge puts this PR behind the default branch, run `gh pr update-branch <pr>` yourself — never leave the button to the human. The update push restarts the bot round; what follows is a new round.

## Acceptance criteria

- Machine-confirm the round with `"${CLAUDE_SKILL_DIR}/scripts/round-state.sh" <pr>` — it folds in `verify-coverage.sh`: every reviewer line settled (reviewed-clean / abstained / prior-round with threads answered), `threads` reads `answered N / N`, and `summary` reads `posted`. A `summary MISSING` line blocks any handoff or "ready to merge" claim, in chat or anywhere else.
- The round-summary comment is on the PR (step 7) and matches the threads — every fixed item names its sha, every rebuttal its reason.
- Exactly one push carried the round's whole batch; no extra push re-triggered the bots mid-round.
- Any sub-issue you opened is linked to the parent and carries `Closes #<sub>` in the PR body.

## Checklist

Materialize as tracked tasks at round open, one per item; tick only on the verifier's real output. Repeat the whole list each round until `round-state.sh` reads `next handoff`.

- [ ] Round arrived — verifier: `wait-for-round.sh <pr>` exit line
- [ ] State read, findings and MISSING threads listed — verifier: `round-state.sh <pr>` output
- [ ] Every finding adjudicated with evidence (fix or rebut) — verifier: the per-finding verdict list
- [ ] Fixes batched into one push, pre-flighted — verifier: `round-state.sh` shows no MISSING immediately before the push, then the push output
- [ ] Every thread replied — verifier: `round-state.sh` threads line reads `answered N / N`
- [ ] Round summary on the PR — verifier: `round-state.sh` summary line reads `posted`
- [ ] Merge link handed to the human — verifier: `round-state.sh` next line reads `handoff`

## Output

| Round | PR      | Findings              | Fixed                 | Pushed             |
| ----- | ------- | --------------------- | --------------------- | ------------------ |
| `<k>` | `#<pr>` | `<real>` after verify | `<closed>` sub-issues | `<sha>` (one push) |
