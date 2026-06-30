---
"@friday-sandbox/styles": major
---

Remove the `./template` subpath export and its `src/theme-template.css` starter. Nothing consumed it, and it duplicated the base tokens already declared in `tokens.css`. Theme authors override the base `--fri-*` tokens directly — `tokens.css` is the canonical list of the full base set.

BREAKING CHANGE: the `@friday-sandbox/styles/template` package export is removed.
