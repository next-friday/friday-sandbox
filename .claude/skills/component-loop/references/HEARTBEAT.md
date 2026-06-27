# Running the loop unattended (heartbeat)

Optional. Requires an **external scheduler** — your harness's cron / `/goal`, which is **not provided by this repo**. Add it only if the cadence earns it; there is no schedule by default. The human still owns the merge.

- **Each tick** reads the disk state file and advances every authorized pipeline through its next autonomous span — build → verify (`pnpm lint:symmetry` + sub-agent) → ship → AI-review-to-clean — then stops.
- **`/goal` stopping condition:** a tick ends when each pipeline reaches its human gate (every AI reviewer clean) or is blocked; it never runs past the gate.
- **Triage inbox:** surface each paused pipeline — awaiting the human merge gate, or blocked — so the human can act.
- **Scope:** only pipelines the human authorized up front (step 1) are picked up; the schedule itself (interval, trigger) is configured per environment.
- **Never auto-merges.** The heartbeat automates the autonomous spans only; the human gate stays the sole merge authority — the line between a good loop and an unattended one making unverified mistakes.
