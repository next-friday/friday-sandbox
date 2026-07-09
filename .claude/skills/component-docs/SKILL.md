---
name: component-docs
description: Use to sync a base component's docs page after use-case stories are added in Storybook — read the built component and its stories, add the use-case demos to `<name>.mdx` just before the Props section, and refresh the Props and Styling tables from source. Triggers "sync the component docs", "update the docs from the stories", "pull the new stories into the docs". Not for the initial docs (component-implement) or bot-review triage (component-rebut).
---

# Component docs

## Purpose

Sync `<name>.mdx` to `<name>.stories.tsx` for a `@friday-sandbox/react` base component: add the use-case demos, refresh the Props and Styling tables from source.

## Input

- The built component (`<name>.tsx`, `<name>.styles.ts`, `packages/styles/src/components/<name>.css`) and its stories (`<name>.stories.tsx`), with use-case stories added or changed.

## Tasks

1. Read `<name>.stories.tsx`, `<name>.tsx`, `<name>.styles.ts`, `packages/styles/src/components/<name>.css`.
2. Mirror the use-case stories both ways ([`.claude/rules/stories-docs-sync.md`](../../rules/stories-docs-sync.md)): for each story export beyond the `Default` / `Variants` / `Sizes` showcases, add one `##` section **with the same name as the story export**, just before `## Props`, in the `<Tabs items={["Preview", "Code"]}>` Preview + Code shape the other sections use, copying the story's demo; for each feature section whose story export was renamed or deleted, rename or delete the section to match.
3. Re-derive the Props tables from the real props — [`.claude/rules/doc-skeletons.md`](../../rules/doc-skeletons.md)'s column set, one table per part for a compound (`### <Name> Props` / `### <Name>.<Part> Props`) — and the Styling modifier-class table from the `fri-<name>-<value>` classes in `.css` — every value a row, no orphan.
4. Leave the showcase and spine sections unchanged unless the variant/size axis they describe changed.

## Rules

- Never invent a use case the stories do not contain — mirror only.
- Never rewrite Usage, Purpose, or feature sections whose source did not change — that is `component-implement`.
- Never fill a Props or Styling row from memory — read the tsx/styles/css ([`.claude/rules/no-guessing.md`](../../rules/no-guessing.md)).
- Do not run whole-repo gates by hand — the hooks own them.

## Acceptance criteria

- `node --experimental-strip-types "${CLAUDE_SKILL_DIR}/scripts/story-doc-diff.ts" <name>` reports a 1:1 mirror — every use-case story has a same-named `##` section before `## Props` mirroring its demo, and every feature section names an existing story export.
- Props tables match the real props (per part for a compound); Styling classes match `.css` 1:1, no orphan.
- [`.claude/rules/prose-voice.md`](../../rules/prose-voice.md) voice; no marketing words; no use case invented.
