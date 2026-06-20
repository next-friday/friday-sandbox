# No Magic Values

**Rule:** Every value in component CSS — size, radius, spacing, duration, color, opacity, font size — resolves from an **overridable token**: a `:root` theme variable, a family unit (`--size-*` / `--radius-*`), or a theme-mapped Tailwind utility, consumed through `var()` / `calc()`. A raw literal baked into a component (`0.625rem`, `100ms`, `text-[0.6875rem]`) is **unreachable**: consumers of the library are not contributors and cannot edit component source, so any value they cannot reach through a token can never be re-themed. Forbidden.

This reaches two places that look exempt but are not. **Colors** always come from a `:root` theme variable (`var(--primary)`) or a local var that derives from one — never a raw `oklch()` / hex / named color in `components/`. And the **ratios inside `calc()` / `color-mix()`** — a multiplier, a mix `%` — are values too: lift each to a named token instead of inlining a bare `14%` or `2.5`.

## Bad

```css
.fri-scroll-area {
  --scroll-area-thickness: 0.625rem; /* ← literal. consumer cannot retheme it. */
}
.fri-scroll-area-thumb {
  transition: background-color 100ms ease-out; /* ← literal duration */
}
.fri-button-xs {
  @apply text-[0.6875rem]; /* ← arbitrary font size, off every scale */
}
.fri-button {
  --button-background: oklch(60% 0.19 21); /* ← raw color, not a theme token */
  --button-background-hover: color-mix(
    in srgb,
    var(--button-background),
    var(--button-color-foreground) 14% /* ← bare ratio inlined */
  );
}
```

## Good

```css
.fri-scroll-area {
  --scroll-area-n: 2.5; /* unitless config */
  --scroll-area-thickness: calc(var(--size-box) * var(--scroll-area-n));
}
.fri-scroll-area-thumb {
  @apply transition-colors duration-100 ease-out; /* theme-mapped utility */
}
.fri-button {
  --button-color: var(--danger); /* color from the theme token */
  --button-bg-mix-hover: 14%; /* ratio named once, overridable */
  --button-background-hover: color-mix(
    in srgb,
    var(--button-background),
    var(--button-color-foreground) var(--button-bg-mix-hover)
  );
}
```

Override `--size-box` in a theme and every scrollbar scales with it; override `--button-bg-mix-hover` and every button's hover retunes. The literals could not do that.

## Why

The library's only surface for customization is the **token layer** — the variables documented in [the Styles chapter](../README.md). A consumer re-themes by overriding tokens, never by editing `components/*.css`. A literal in a component is therefore a dead end: it forks one value out of the theme and silently denies the consumer any control over it. Magic numbers also drift — the same `100ms` retyped in five components has five owners and no single source of truth.

## How to apply

- Before typing a number with a unit in component CSS, name the token it derives from (`--size-*`, `--radius-*`, a theme color, a Tailwind theme utility). None fits? Add a token to the theme (see [the Styles chapter](../README.md)) and consume it — do not inline.
- Unitless multipliers (`--scroll-area-n: 2.5`, `--action-n: 10`) are configuration, not magic: they are fine as local vars because the _unit_ they multiply is a token.
- Expose a **scale** (the per-size steps of a multiplier) as one named token per step in the base rule — `--scroll-area-n-xs` … `--scroll-area-n-lg` — and have each size class read its step (`--scroll-area-n: var(--scroll-area-n-md)`); the base default reads the same step (`--scroll-area-n: var(--scroll-area-n-md)`). A consumer then retunes the whole scale from one place, at any level — `:root { --scroll-area-n-md: 3 }` resizes every `md` — with no fork and no per-class edits.
- Colors come from a `:root` theme token (`var(--primary)`, `var(--danger)`) or a local var that derives from one (`--button-color: var(--primary)`) — never a raw `oklch()` / hex / named color in `components/`.
- A bare number inside `calc()` / `color-mix()` (a multiplier, a mix `%`) is still a magic value — lift it to a named local var (`--button-bg-mix-hover: 14%`) and reference it. The literal then lives once, named and overridable; the expression stays free of inline constants.
- Theme-backed Tailwind utilities (`duration-100`, `gap-2`, `text-sm`, `rounded-action`) count as tokens. Arbitrary values (`text-[0.6875rem]`, `[100ms]`, `bg-[#fff]`) do not — they are literals in disguise.
- Size and radius carry a stricter form: they must derive from a _semantic family_ unit — see [`semantic-token-scope.md`](semantic-token-scope.md).
