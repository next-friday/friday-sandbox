# Diagnosing a red gate

When a story, `lint:symmetry`, or a Chromatic diff goes red, don't patch the symptom — diagnose.

## The loop is the skill

Get a tight, red-capable command on the exact symptom first — `pnpm --filter @friday-sandbox/react exec vitest run <name>` for one story, or the failing gate's own command. No red-capable command, no fixing.

## Hypotheses before fixes

Write 3–5 falsifiable hypotheses before testing any. For a `fri-` class that won't style: `:where()` specificity vs the wrong `--fri-<role>` slot vs the ramp multiplier vs a missing `@import` in `bases/index.css` vs a data-attr selector. A single hypothesis anchors on the first plausible idea. Show the ranked list; proceed on your ranking if the user is away.

## Fix at the source layer

Trace back to the original trigger and fix there, never where the error surfaces. A class with no styling is fixed in the `tv()` mapping, the `@layer components` rule, the `@import`, or the token — not by hard-coding at the symptom.

## Escalation tripwire

Count the fixes. If a third fix reveals new coupling somewhere else — a style chased across `.styles.ts` → `.css` → token → barrel, each fix surfacing a fresh break — STOP: the component's variant or token shape is wrong. Escalate to `component-blueprint`; do not attempt fix #4.
