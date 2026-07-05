---
paths:
  - "**/*.stories.tsx"
  - "apps/docs/content/docs/**/*.mdx"
---

# Rule: minimal examples — show the prop, never the default

A story or a doc demo teaches by example, so every prop it sets reads as "you
need this." Spelling out a prop whose value is already the component's default
teaches the opposite of the truth: a reader copies `variant="solid"` or
`size="md"` believing it is required, when omitting it renders the same thing.
No library writes examples this way — `<Link href="…">Docs</Link>`, not
`<Link href="…" variant="inherit" decoration="underline">Docs</Link>`. Every
default written is code a consumer maintains for nothing and a lie about the API.

Show only what the example demonstrates:

- **`meta.args` holds content and deliberate non-defaults only** — the demo's
  children, an `href`, a `cols={3}` that differs from the `cols: 1` default.
  Never a key whose value equals that key's `defaultVariants` value; the
  `lint:symmetry` `no-default-args` dimension gates this half and fails the
  commit.
- **A per-story prop is set only when it differs from the default**, or when the
  story is the **showcase for that axis** — a `Sizes` story listing every size
  including `md`, a `Variant` story showing the default variant value. There,
  writing the default is the point; everywhere else it is noise.
- **The same holds for `.mdx` demos** — the `## Usage` demo is minimal, a
  feature section sets only its own axis, and a value equal to the default
  appears only inside the section whose subject is that prop.

How to apply:

- Adding a prop to a story or demo? Check it against the component's
  `defaultVariants` (and boolean defaults of `false`). Equal to the default and
  not the story's subject → drop it.
- Reaching for `meta.args` to set a variant/size/color? Set it only if it is
  content or a non-default base value; a default there fails the gate.
- Writing a showcase that iterates an axis? Keep the default value in that one
  story — it belongs to the axis it demonstrates.

The `meta.args` half is gated by `lint:symmetry`; the per-story and per-demo
judgment — a showcase's default versus an incidental one — is the ungated half a
human still holds. Pairs with follow-local-pattern and no-redundancy.
