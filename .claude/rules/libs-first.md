# Rule: libs-first — reach for a standard tool before hand-writing

Before hand-writing logic, reach for the domain-standard library, linter, or
platform feature that already solves it. A hand-rolled solution is a hole
factory: a regex over CSS or TS produces false negatives an AST-based linter
cannot, and every line written is a line maintained. Compose the existing tool;
hand-write only the genuinely custom part.

The ladder — stop at the first rung that holds:

- **A standard linter or tool covers it?** Use it. Prefer stylelint over a regex
  scan of CSS, eslint over a grep of TS, markdownlint over a hand-checked
  Markdown convention — the tool reads a real AST, a text scan guesses.
- **A native platform feature covers it?** Use it before a dependency.
- **An already-installed dependency solves it?** Use it. Never add a new
  dependency for what a few lines do.
- **Only then** hand-write, and only the part no tool provides.

A hand-rolled solution where a standard tool exists needs an explicit reason in
the commit body: what the tool could not do. "It was faster to write" is not a
reason.

Pairs with no-redundancy (reuse over recreate) and no-guessing (read the tool's
docs before assuming it can't do the job).
