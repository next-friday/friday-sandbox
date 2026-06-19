---
paths:
  - "**/*.{ts,tsx,mts,cts,js,mjs,cjs,jsx,mdx}"
  - "**/*.css"
---

# Canonical Tailwind Classes

**Rule:** When a CSS variable is registered in `@theme inline` (see `packages/styles/src/system/theme.css`), use its **canonical Tailwind utility** — never the arbitrary-var fallback. `text-foreground`, not `text-(--foreground)`. `bg-muted`, not `bg-(--muted)`. `border-primary`, not `border-(--primary)`.

The arbitrary-var syntax `text-(--var)` is the v3-era escape hatch. In v4 with `@theme inline`, every theme token has a real Tailwind alias. Using the escape hatch on a token that has an alias is **old Tailwind**: noisier, harder to grep, and trips `suggestCanonicalClasses`.

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

## When `(--var)` IS correct

Only when the variable is **component-local** and has no Tailwind alias. Example: `--button-background`, `--action-height`, `--action-padding-x` live inside a component's CSS and are not registered in `@theme inline`. They have no canonical utility; `bg-(--button-background)` is the right form there.

## How to apply

- Open `packages/styles/src/system/theme.css`. Every `--color-*`, `--radius-*`, `--border` listed there has a canonical Tailwind alias.
- Theme color tokens (`--background`, `--foreground`, `--muted`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--neutral`, `--neutral-foreground`, `--info`, `--info-foreground`, `--success`, `--success-foreground`, `--warning`, `--warning-foreground`, `--danger`, `--danger-foreground`, `--muted-foreground`) → use `bg-<name>` / `text-<name>` / `border-<name>` / `ring-<name>` / `fill-<name>` / `stroke-<name>` / `from-<name>` / `to-<name>` / `via-<name>` / `divide-<name>` / `outline-<name>` / `decoration-<name>` / `accent-<name>` / `caret-<name>` / `placeholder-<name>` / `shadow-<name>`.
- Radius tokens (`--radius-action`, `--radius-field`, `--radius-box`) → `rounded-action` / `rounded-field` / `rounded-box`.
- Component-local vars (anything not in `map.css`) → keep arbitrary-var syntax `bg-(--var)`.
- Before writing `*-(--var)`, grep `packages/styles/src/system/theme.css` for the var. If it's mapped, switch to canonical. If not, arbitrary-var is correct.
