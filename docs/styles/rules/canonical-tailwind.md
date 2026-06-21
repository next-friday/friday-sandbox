# Canonical Tailwind Classes

**Rule:** When a CSS variable is registered in `@theme inline`, defined in `packages/styles/src/system/theme.css`, use its **canonical Tailwind utility**, never the arbitrary-var fallback. Write `text-foreground`, not `text-(--foreground)`. Write `bg-muted`, not `bg-(--muted)`. Write `border-primary`, not `border-(--primary)`.

The arbitrary-var syntax `text-(--var)` is the v3-era escape hatch. In v4 with `@theme inline`, every theme token has a real Tailwind alias. Using the escape hatch on a token that has an alias is **old Tailwind**: noisier and harder to grep. No lint rule catches it; the gate is the PR reviewers.

## Bad

```tsx
<div className="rounded-md bg-(--muted) px-4 py-2 text-sm text-(--foreground)">
<div className="border border-(--muted)" />
```

`--muted` and `--foreground` are both mapped in `@theme inline`. Canonical aliases exist. The arbitrary-var form is noise.

## Good

```tsx
<div className="rounded-md bg-muted px-4 py-2 text-sm text-foreground">
<div className="border border-muted" />
```

The alias comes from the key, not the value. In `@theme inline` the entry `--color-foreground: var(--foreground)` is what makes Tailwind emit `text-foreground`, `bg-foreground`, `border-foreground`, and the rest of the color utilities for `--foreground`. The `--color-*` prefix is the contract: register a token under it and its canonical utility exists, so reach for the utility rather than the raw var.

## Why

The arbitrary-var form and the canonical alias paint the same pixels, so this is about the codebase, not the render. A token registered in `@theme inline` already has an alias; writing `bg-(--muted)` next to `bg-muted` elsewhere splits one concept across two spellings, which is harder to grep and review. The alias also reads as intent: `text-foreground` names the role, while `text-(--foreground)` exposes plumbing. Reserving the `(--var)` form for component-local vars keeps a clean signal: an arbitrary var in the source means "this has no theme alias," every time.

## When `(--var)` IS correct

Only when the variable is **component-local** and has no Tailwind alias. Example: `--button-background`, `--action-height`, `--action-padding-x` live inside a component's CSS and are not registered in `@theme inline`. They have no canonical utility; `bg-(--button-background)` is the right form there.

## How to apply

- Open `packages/styles/src/system/theme.css`. Every `--color-*`, `--radius-*`, `--border` listed there has a canonical Tailwind alias.
- Theme color tokens, namely `--background`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--neutral`, `--info`, `--info-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--danger`, and `--danger-foreground` → use `bg-<name>` / `text-<name>` / `border-<name>` / `ring-<name>` / `fill-<name>` / `stroke-<name>` / `from-<name>` / `to-<name>` / `via-<name>` / `divide-<name>` / `outline-<name>` / `decoration-<name>` / `accent-<name>` / `caret-<name>` / `placeholder-<name>` / `shadow-<name>`.
- Radius tokens, namely `--radius-action`, `--radius-field`, and `--radius-box` → `rounded-action` / `rounded-field` / `rounded-box`.
- Component-local vars, meaning anything not registered in `@theme inline` → keep arbitrary-var syntax `bg-(--var)`.
- Before writing `*-(--var)`, grep `packages/styles/src/system/theme.css` for the var. If it's mapped, switch to canonical. If not, arbitrary-var is correct.
