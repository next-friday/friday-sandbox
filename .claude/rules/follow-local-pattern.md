# Rule: follow the local pattern — match the neighbors, not just the schema

Before adding to an existing file, read two or three neighboring entries and
match their style: comment terseness, punctuation, ordering, naming, table
column set, and phrasing. Structural correctness is not enough. An entry that is
valid but off-style — a longer comment than its siblings, a different verb mood,
keys in a new order — is a silent asymmetry: no gate flags it, and the file
slowly stops reading as if one author wrote it.

How to apply:

- Open the file being edited and read the entries already there before writing
  yours. Copy their shape, not just the structure a schema would accept.
- Match the smallest details: how neighbors abbreviate, whether a cell ends with
  a period, the order of fields, the width of a description.
- Do not restyle the surrounding entries while there — an unrequested rewrite of
  code you did not add is its own asymmetry and churns the diff.

The component-level version of this — the variant-map to css mirror, the barrel
order — is gated by lint:symmetry. This rule is the ungated half: the prose and
table symmetry a human still has to hold.

Pairs with no-redundancy and docs-follow-code.
