---
name: docs-follow-code
description: Use after changing code whose describing artifacts may now lag — a rename, move, delete, restructure, or a change to an export, token, script, config, or build step — or on "update docs", "sync docs", "docs outdated", "are the docs caught up with the code". Not for writing new documentation from scratch.
---

# Docs follow code

## Purpose

Executable procedure for the `docs-follow-code` rule (`.claude/rules/docs-follow-code.md`): a grep-driven sweep that updates every artifact describing the changed code in the SAME change, proven by re-grepping the OLD terms to zero.

## Input

- A code change, and the artifacts (docs, configs, mirrors, generators) that describe what it touched.

## Tasks

1. **Derive the rename table from the diff, not memory.** `git status` / `git diff` → list every old→new pair: paths, file names, exports, tokens, script names, directory shapes, commands, and count claims ("3 barrels", "7 files"). Each OLD term becomes a search query. Name the two changes that leave **no OLD term to grep**: a **changed concept or behavior** (how theming works, what a token derives, how a component is consumed) → query the concept word (`theming`, `seed`, `data-theme`, `import`), not a renamed string; a **changed set** (a role removed, a section reordered, a seed added) → re-derive every doc that _enumerates_ that set from the code, never find-replace it.

2. **Grep each OLD term repo-wide.** The old term is the query. Every term has up to three spellings; grep all that apply:
   - concrete: `components/button/button.css`
   - generator template: `{{ kebabCase name }}/{{ kebabCase name }}.css`
   - doc placeholder: `<name>/<name>.css`

   For an ambiguous short term (a directory that shares a framework's name, a token suffix that is an English word): query the path-shaped or delimiter-bound form and eyeball every hit; never batch-replace on a bare word.

3. **Walk the full target table** — check each row deliberately:

   | class             | targets                                                                                                                 |
   | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
   | LLM docs          | `CLAUDE.md`, `.coderabbit.yaml`, `.gemini/styleguide.md`, `.claude/rules/**`, `.claude/skills/**`                       |
   | Prose docs        | `CONTRIBUTING.md`, every `README.md`, `apps/docs/**/*.mdx`                                                              |
   | Generators        | `turbo/generators/config.ts` + `templates/*.hbs` — fix the template AND its generated output in the same pass           |
   | Gates + scripts   | `scripts/*.sh`, every `package.json` script, husky hooks                                                                |
   | Configs           | `knip.config.ts`, `.prettierrc.json`, `turbo.json`, `tsconfig*`, `.dependency-cruiser.cjs`, `clean-package.config.json` |
   | Release artifacts | `.changeset/*.md` — FLAG to the user, never edit silently                                                               |

4. **Fan out the search.** Dispatch one searcher sub-agent per target-table class in a **single message** — each gets the OLD-term list and its class's file globs and returns `file:line` hits, no edits. Size each to the task: **haiku** for a plain single-term grep, **sonnet** for a class that needs an eyeball on ambiguous or prose hits; never **opus**. The main thread derives the term table, merges the searchers' hits, applies the edits, and re-greps.

5. **Align every mirror; enumerate the full set.** Grep by the **concept**, not the changed term, and update every copy in the same pass — a package `README.md`'s Theming section, the docs site's `theming/*.mdx`, and `.claude/rules/token-pipeline.md` all describe the token model; a component's `.mdx` and its `.hbs` template share a spine. A doc that **enumerates** a code set — the color roles, the seed tokens, a component's doc sections, a package's exports — lists the _full current_ set: re-derive the list from the code, never trust or extend the doc's existing one.

## Rules

- Grep the OLD term everywhere; never spot-fix only the files you remember.
- A path change still requires the full sweep.
- Sweep the generator templates in the same pass, not later.
- Never batch-replace on a bare word; query the delimiter-bound form and eyeball every hit.
- Fan out one searcher per target-table class in one message; never sweep every class serially on the main thread.
- Grep the concept, not the term; align every mirror copy (`README` / `ARCHITECTURE` / `.mdx`) in the same pass.
- A doc that enumerates a code set lists the full current set, re-derived from code — never a subset.
- When a utility/token/feature is deleted, grep the deleted name everywhere (`.claude/**`, `.gemini/**`, and generator templates included); delete the dead feature doc, re-point the example to a surviving one.
- `.changeset/*.md`: FLAG to the user, never edit silently.
- Protected files (hook-blocked writes, e.g. `.prettierrc.json`): report the exact diff for the user to apply by hand; never bypass or work around the hook.
- Never claim docs updated without pasted gate output and a zero-hit re-grep.

## Acceptance criteria

- Let the pre-commit and pre-push hooks run the gates; show their real output as evidence. Never invoke the whole-repo gates by hand. "Should pass" is not evidence; pasted output is.
- Re-grep the OLD terms even when the gates pass. Zero hits (outside `.changeset/` items flagged in step 3) = done. Absence of the old term is the proof; presence of the new term is not.
