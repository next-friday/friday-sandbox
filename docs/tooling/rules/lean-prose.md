# Lean Prose

**Rule:** Documentation prose is direct and token-lean. It drops punctuation that costs tokens without adding meaning: no em-dash, no parenthetical aside. The result reads the same to a person and to an LLM, with fewer tokens.

## Bad

```md
The `md` size is the default — large enough for touch — and `xl` (the biggest) suits hero actions.
```

## Good

```md
The `md` size is the default and large enough for touch. The `xl` size suits hero actions.
```

## Why

An em-dash and a parenthetical each wrap an aside the sentence can carry on its own. Removing them shortens the line and lowers the token count while reading the same to a person and to a model. Two short sentences beat one long sentence stitched together with dashes.

## How to apply

- Replace an em-dash with a period, a comma, or a colon. Split one long sentence into two when that reads cleaner.
- When the two halves are independent clauses, prefer a period. A comma between them is a comma-spliced run-on, which is not a fix.
- Fold a parenthetical aside into the sentence, or delete it. An aside that matters earns a full clause.
- This governs prose only. Keep parentheses that belong to code: a call like `useState()`, a function like `calc()`, a glob like `!(*README*)`, and a Markdown link target like `[text](url)`.
- Do not swap one banned mark for another. An en-dash, an ellipsis, or a semicolon is not a fix.
- Applies to every Markdown doc, every package README, every changeset summary, and the story copy a consumer reads.
