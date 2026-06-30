---
"@friday-sandbox/styles": major
---

Remove the `--fri-radius-*` token scale and its `--fri-<archetype>-radius` geometry archetypes; components now use Tailwind v4's native `rounded-*` utilities for corner radius. The generated `design.md` token contract is dropped, leaving `tokens/default.spec.json` as the single source for the token set. The `radius` spec knob and its JSON Schema entry are removed.

BREAKING CHANGE: the public `--fri-radius-none/xs/sm/md/lg/xl/full` tokens and the `--fri-<archetype>-radius` archetypes are removed — use Tailwind's native `rounded-*` utilities. The `radius` key in the theme spec is no longer read.
