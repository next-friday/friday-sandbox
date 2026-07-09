# Rule: no prettier suppressions — formatting is never negotiated inline

Prettier owns formatting so no human or LLM has to. An inline opt-out trades a
solved problem back into a per-line judgment call and breaks the one-author
look the formatter exists to keep.

Never, in authored source (a generated or gitignored artifact is outside this
rule):

- an inline suppression — `prettier-ignore`, `biome-ignore`
- a path added to `.prettierignore` to dodge formatting — ignoring a build
  artifact is configuration, not suppression
- shrinking the `format`/`format:check` globs or a lint-staged pattern so a
  file type stops being formatted

How to apply:

- Prettier's output looks wrong? Restructure the code until the formatted form
  reads well — split the expression, name the intermediate, unnest.
- A whole file type is unformattable by design? That is a config change in its
  own commit with a stated reason — never an inline marker.

Pairs with no-eslint-suppressions and no-typescript-suppressions (the linter
and compiler halves) and no-code-comments (a suppression is also a comment).
