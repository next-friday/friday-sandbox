# Diagnosing a red gate

When a story, `lint:symmetry`, or a Chromatic diff goes red, don't patch the symptom — diagnose.

## Spec defect, or residual defect?

First decide which side of the boundary the red gate is on. The generated surfaces (`<name>.tsx`, `<name>.styles.ts`, `<name>.css`, `<name>.stories.tsx`'s axis showcases, `<name>.mdx`) are correct by construction from the issue's `ComponentSpec` — a wrong token, a missing variant value, or an orphaned class there is a **spec defect**: fix it in `component-blueprint`'s spec and rerun the generator, never hand-patch the generated file. Only the residual — `<name>.play.ts` and the prose polish — is hand-authored here, so only there does a direct hand-fix apply.

## The loop is the skill

Get a tight, red-capable command on the exact symptom first — `pnpm --filter @friday-sandbox/react exec vitest run <name>` for one story, or the failing gate's own command. No red-capable command, no fixing.

## Hypotheses before fixes

Write 3–5 falsifiable hypotheses before testing any. For a `<name>.play.ts` assertion that won't pass: a wrong selector vs a race with an animation vs an event the primitive doesn't emit vs a stale `data-slot` the generator renamed. A single hypothesis anchors on the first plausible idea. Show the ranked list; proceed on your ranking if the user is away.

## Fix at the source layer

Trace back to the original trigger and fix there, never where the error surfaces. A generated class with no styling traces to the spec's `tokens`/`variants` field, not the emitted CSS rule; a `<name>.play.ts` assertion that targets the wrong element traces to the test's selector, not a hand-added `data-testid` on the generated component.

## Escalation tripwire

Count the fixes. If a third fix reveals new coupling somewhere else — a defect chased from the story to the spec to the token, each fix surfacing a fresh break — STOP: the spec's variant or token shape is wrong. Escalate to `component-blueprint`; do not attempt fix #4, and never hand-patch a fourth generated file to paper over a spec that needs revising.
