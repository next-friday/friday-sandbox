---
name: docs-follow-code
description: Use after changing code whose describing artifacts may now lag — a rename, move, delete, restructure, or a change to an export, token, script, config, or build step — or on "update docs", "sync docs", "docs outdated", "are the docs caught up with the code". Not for writing new documentation from scratch.
---

# Docs follow code — the sweep

Executable procedure for the `docs-follow-code` rule (`.claude/rules/docs-follow-code.md`): the code is the source of truth, and every artifact describing it updates in the SAME change. This skill turns the rule into a grep-driven sweep with deterministic proof — a change is not done while any artifact still describes the old state.

## Steps

1. **Derive the rename table from the diff, not memory.** `git status` / `git diff` → list every old→new pair: paths, file names, exports, tokens, script names, directory shapes, commands, and count claims ("3 barrels", "7 files"). Each OLD term becomes a search query. Two kinds of change leave **no OLD term to grep** — name them explicitly or the sweep misses them: a **changed concept or behavior** (how theming works, what a token derives, how a component is consumed) → query the concept word (`theming`, `seed`, `data-theme`, `import`), not a renamed string; and a **changed set** (a role removed, a section reordered, a seed added) → every doc that _enumerates_ that set must be re-derived from the code, not find-replaced.

2. **Grep each OLD term repo-wide.** The old term is the query — spot-fixing the files you remember is not a sweep. Every term has up to three spellings; grep all that apply:
   - concrete: `components/button/button.css`
   - generator template: `{{ kebabCase name }}/{{ kebabCase name }}.css`
   - doc placeholder: `<name>/<name>.css`

   Ambiguous short terms (a directory that shares a framework's name, a token suffix that is an English word): query the path-shaped or delimiter-bound form and eyeball every hit — never batch-replace on a bare word.

3. **Walk the full target table** — one grep pattern cannot name every class; check each row deliberately:

   | class             | targets                                                                                                                                                        |
   | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | LLM docs          | `CLAUDE.md`, `.coderabbit.yaml`, `.gemini/styleguide.md`, `.claude/rules/**`, `.claude/skills/**`                                                              |
   | Prose docs        | `CONTRIBUTING.md`, every `README.md`, `apps/docs/**/*.mdx`                                                                                                     |
   | Generators        | `turbo/generators/config.ts` + `templates/*.hbs` — a stale template regenerates stale docs forever; fix the template AND its generated output in the same pass |
   | Gates + scripts   | `scripts/*.sh`, every `package.json` script, husky hooks                                                                                                       |
   | Configs           | `knip.config.ts`, `.prettierrc.json`, `turbo.json`, `tsconfig*`, `.dependency-cruiser.cjs`, `clean-package.config.json`                                        |
   | Release artifacts | `.changeset/*.md` — FLAG to the user, never edit silently: a changeset is consumer-facing release voice and controls versioning                                |

   **Fan out the search.** Dispatch one searcher sub-agent per target-table class in a **single message** so they grep concurrently — each gets the OLD-term list and its class's file globs and returns `file:line` hits, no edits. Size each to the task: **haiku** for a plain single-term grep, **sonnet** for a class that needs an eyeball on ambiguous or prose hits (a mechanical sweep never needs **opus** — reserve that tier for judgment). The main thread owns steps 1, 4, and 5 — derive the term table, apply the edits, run the gates, re-grep — and merges the searchers' hits before editing. A serial sweep across every class is what drags (and can time out); the parallel fan-out is the speedup.

   **Mirror prose — align every copy, and enumerate the full set.** One concept is usually documented in more than one surface: a package `README.md`'s Theming section, the docs site's `theming/*.mdx`, and `.claude/rules/architecture.md`'s pipeline all describe the token model; a component's `.mdx` and its `.hbs` template share a spine. Grep by the **concept**, not the changed term, and update every copy in the same pass — a fix to one that skips its mirror leaves the two disagreeing (that is the most common "docs didn't capture the work" gap). And a doc that **enumerates** a code set — the color roles, the seed tokens, a component's doc sections, a package's exports — must list the _full current_ set: re-derive the list from the code, never trust or extend the doc's existing one, or it silently under-specifies (a theme example with 4 of the ~18 seeds reads as "that's all there is").

4. **Prove, don't claim.** Let the pre-commit and pre-push hooks run the gates and show their real output as evidence; never invoke the whole-repo gates by hand. "Should pass" is not evidence; pasted output is.

5. **Re-grep the OLD terms.** Zero hits (outside `.changeset/` items flagged in step 3) = done. Edits without the re-grep are not done — absence of the old term is the proof, presence of the new term is not.

6. **Protected files** (hook-blocked writes, e.g. `.prettierrc.json`): report the exact diff for the user to apply by hand; never bypass or work around the hook.

## Baseline failures this counters (all observed in this repo)

| failure                                                                                                                                                                                                                                                                 | counter                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Renamed tokens with perl over `@apply` lines only → `var()` refs inside `calc()` left dangling                                                                                                                                                                          | step 2 — grep the OLD term everywhere, not the sites you remember touching                                                                                                |
| Swept generated `.mdx` but not `mdx.hbs` → the next `pnpm gen component` regenerated the stale links                                                                                                                                                                    | step 3 — templates are canonical; sweep them first                                                                                                                        |
| Scoped the sweep to "docs" → missed `.prettierrc.json` `tailwindStylesheet` → prettier/eslint broke repo-wide                                                                                                                                                           | step 3 — configs describe the code too                                                                                                                                    |
| Verified by grepping the NEW term ("the new path is there")                                                                                                                                                                                                             | step 5 — only zero hits of the OLD term proves the sweep                                                                                                                  |
| Treated `.changeset/*.md` like ordinary prose to rewrite                                                                                                                                                                                                                | step 3 — flag it; the user owns release voice                                                                                                                             |
| Updated the docs `theming.mdx` but not the styles `README.md`'s mirror Theming section → the two disagree                                                                                                                                                               | step 3 — grep the concept, align every mirror in the same pass                                                                                                            |
| A theme example listed 4 of ~18 seed tokens (or 6 of 7 roles) → readers followed an incomplete set                                                                                                                                                                      | step 3 — enumerations reflect the full current set, re-derived from code                                                                                                  |
| Deleted a `@utility`/token/feature but left the doc that **documents** it (a README "Native scrollbars" feature bullet) or **cites** it as the canonical example (`scrollbar-thin` in the `@utility` examples) → docs promise a gone feature or cite a dangling example | step 2 — grep the deleted name repo-wide incl. `.claude/**`, `.gemini/**`, and generator templates; delete the feature's doc, re-point the example to a surviving utility |

## Red flags — stop and run the full sweep

- "It's just a path change; docs are probably fine."
- "The gates pass, no need to re-grep." (Gates don't read prose.)
- "I'll catch the templates later."
- "Docs are updated" — said without pasted gate output and a zero-hit re-grep.
- Sweeping every target class serially on the main thread → slow (it can time out); fan out one searcher per class in one message.
- Fixed a concept in one doc, left its mirror in another `README` / `ARCHITECTURE` / `.mdx` stale — grep the concept, not the term, and align every copy.
- A doc enumerates a subset of a code set (some roles, some seeds, some sections) — re-derive and list the full current set.
- Deleted a utility/token/feature but a doc still **documents it as a feature** or **cites it as the canonical example** — grep the deleted name everywhere (governance docs and generator templates included); delete the dead feature doc, re-point the example to a surviving one.
