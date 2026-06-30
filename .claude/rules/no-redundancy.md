# Rule: No Redundancy, Single Source of Truth

Redundancy is technical debt.

Every fact, value, rule, behavior, definition, and implementation must have exactly one canonical source.

Before introducing anything new, determine whether an equivalent implementation or definition already exists.

If it exists:

- Reuse it.
- Extend it if necessary.
- Reference it instead of copying it.

Do not create parallel implementations of the same concept.

This rule applies universally across the entire project. Every artifact, regardless of its language, format, purpose, or location, must have a single canonical source and must not introduce redundant definitions or implementations.

Generated artifacts must never become a second source of truth. If an artifact is generated from a canonical source, modify the canonical source instead of the generated output.

When multiple implementations overlap, consolidate them into the canonical source instead of maintaining multiple copies.

Prefer:

- Extend over duplicate.
- Compose over wrap.
- Reuse over recreate.
- Consolidate over fragment.
- Remove over preserve unused or redundant artifacts.

When modifying existing work, update the canonical implementation instead of introducing new files, wrappers, aliases, or parallel implementations.

Every new abstraction must provide clear value and cannot reasonably be achieved by extending an existing implementation. If no clear justification exists, reuse the existing implementation.
