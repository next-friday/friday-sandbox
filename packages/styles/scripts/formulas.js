// THE single derivation authority. Every ladder rung, surface, text/border
// tier, scale and geometry step lives here exactly once. The CSS emitter
// (codegen.js) and the contrast validator (validate.js) both read this table,
// so the formulas can never drift between the painted CSS and the validated
// numbers. Every color token is `--fri-*` prefixed and every mix is `in oklab`.

/** Vendor prefix for every token. */
export const P = "--fri-";

/** Brand and status roles that own a full interaction ladder. */
export const BRAND_ROLES = [
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "danger",
];

/**
 * The 12 interaction rungs every brand role exposes.
 *   mixFg   — toward the role's foreground (solid hover/pressed)
 *   alpha   — toward transparent (soft/border/outline/tint)
 *   surface — toward the page background (tinted surface fills)
 */
export const LADDER = [
  { suffix: "hover", kind: "mixFg", ratio: "mix-hover" },
  { suffix: "pressed", kind: "mixFg", ratio: "mix-pressed" },
  { suffix: "soft", kind: "alpha", ratio: "mix-soft" },
  { suffix: "soft-hover", kind: "alpha", ratio: "mix-soft-hover" },
  { suffix: "soft-pressed", kind: "alpha", ratio: "mix-soft-pressed" },
  { suffix: "surface", kind: "surface", ratio: "mix-surface" },
  { suffix: "surface-hover", kind: "surface", ratio: "mix-surface-hover" },
  { suffix: "surface-pressed", kind: "surface", ratio: "mix-surface-pressed" },
  { suffix: "border", kind: "alpha", ratio: "mix-border" },
  { suffix: "outline-border", kind: "alpha", ratio: "mix-outline-border" },
  { suffix: "tint-hover", kind: "alpha", ratio: "mix-tint-hover" },
  { suffix: "tint-pressed", kind: "alpha", ratio: "mix-tint-pressed" },
];

/**
 * Shared interaction ratios, emitted as internal `--fri-mix-*` variables so a
 * future intensity knob can scale the whole ladder in one place.
 */
export const MIX_RATIOS = {
  "mix-hover": "14%",
  "mix-pressed": "24%",
  "mix-soft": "12%",
  "mix-soft-hover": "20%",
  "mix-soft-pressed": "28%",
  "mix-surface": "8%",
  "mix-surface-hover": "14%",
  "mix-surface-pressed": "20%",
  "mix-border": "40%",
  "mix-outline-border": "50%",
  "mix-tint-hover": "8%",
  "mix-tint-pressed": "16%",
};

/** Render one ladder rung to its runtime `color-mix` string (`--fri-*`). */
export function ladder(role, suffix) {
  const rung = LADDER.find((r) => r.suffix === suffix);
  if (!rung) throw new Error(`unknown ladder rung: ${suffix}`);
  const r = `var(${P}${role})`;
  const fg = `var(${P}${role}-foreground)`;
  const ratio = `var(${P}${rung.ratio})`;
  switch (rung.kind) {
    case "mixFg":
      return `color-mix(in oklab, ${r}, ${fg} ${ratio})`;
    case "alpha":
      return `color-mix(in oklab, ${r} ${ratio}, transparent)`;
    case "surface":
      return `color-mix(in oklab, ${r} ${ratio}, var(${P}background))`;
    default:
      throw new Error(`unknown rung kind: ${rung.kind}`);
  }
}

/**
 * Surfaces, derived from the ground so a single `--fri-background` override
 * reflows the whole UI. card/popover/field default flat with the page; the
 * neutral surface tiers and the inverse pair carry hue from the ground; the
 * overlay is a fixed dark scrim (a backdrop must darken predictably).
 */
const SURFACE_NEUTRAL_MIX = { surface: 5, "surface-strong": 10 };

export function surface(name) {
  switch (name) {
    case "card":
    case "popover":
    case "field":
      return `var(${P}background)`;
    case "surface":
    case "surface-strong":
      return `color-mix(in oklab, var(${P}background), var(${P}neutral) ${SURFACE_NEUTRAL_MIX[name]}%)`;
    case "inverse":
      return `var(${P}foreground)`;
    case "overlay":
      return `color-mix(in oklab, black 50%, transparent)`;
    default:
      throw new Error(`unknown surface: ${name}`);
  }
}

/** The foreground that pairs with a surface (inverse swaps; the rest = page text). */
export function surfaceForeground(name) {
  return name === "inverse" ? `var(${P}background)` : `var(${P}foreground)`;
}

/** Surfaces that carry a `-foreground` pair. */
export const SURFACES = [
  "card",
  "popover",
  "field",
  "surface",
  "surface-strong",
  "inverse",
];

/** Field-specific extras (border + placeholder), derived. */
export const FIELD_EXTRAS = {
  "field-border-color": `var(${P}border)`,
  "field-placeholder": `var(${P}foreground-muted)`,
};

/** Text emphasis tiers — fade the foreground toward the background. */
export const TEXT_TIERS = { muted: 40, faint: 60 };

export function textTier(name) {
  const pct = TEXT_TIERS[name];
  if (pct == null) throw new Error(`unknown text tier: ${name}`);
  return `color-mix(in oklab, var(${P}foreground), var(${P}background) ${pct}%)`;
}

/** Border/line tiers — fade the neutral toward transparent. */
export const BORDER_TIERS = { strong: 40, default: 60, subtle: 80 };

export function borderTier(name) {
  const pct = BORDER_TIERS[name];
  if (pct == null) throw new Error(`unknown border tier: ${name}`);
  return `color-mix(in oklab, var(${P}neutral), transparent ${pct}%)`;
}

/** Scrollbar thumb, derived from the neutral. */
export const SCROLL_THUMB = {
  "scroll-thumb": `color-mix(in oklab, var(${P}neutral) 40%, transparent)`,
  "scroll-thumb-hover": `color-mix(in oklab, var(${P}neutral) 65%, transparent)`,
  "scroll-track": "transparent",
};

/** Pointers derived from the primary (the consumer may override `--fri-ring`). */
export const POINTERS = { link: `var(${P}primary)` };

/** t-shirt radius scale (Tier 1). Each step distinct; consumer-tunable. */
export const RADIUS_SCALE = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.875rem",
  lg: "1.25rem",
  xl: "2rem",
  full: "9999px",
};

/** Archetype radii alias scale steps (Tier 2): components reference these. */
export const RADIUS_ARCHETYPE = {
  action: "sm",
  field: "sm",
  box: "md",
  feedback: "sm",
};

/** Spacing scale (Tier 1). 4px base with a 2px micro-step. */
export const SPACING_SCALE = {
  xxs: "0.125rem",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  base: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
  section: "4rem",
};

/** Motion (Tier 1). */
export const DURATION = { fast: "100ms", base: "200ms", slow: "300ms" };
export const EASING = {
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
};

/** Stacking scale (Tier 1) — one place prevents z-index wars. */
export const Z_INDEX = {
  base: "0",
  dropdown: "1000",
  sticky: "1100",
  modal: "1300",
  toast: "1400",
};

/** Global scalars. */
export const GLOBALS = {
  "border-width": "1px",
  "font-size-base": "16px",
  "disabled-opacity": "0.5",
  "ring-width": "2px",
  "ring-offset-width": "1px",
};

/** Geometry step counts per size — the only place these magic ramps live. */
export const BUTTON_N = { xs: 7, sm: 8, md: 10, lg: 11, xl: 12 };
export const SCROLL_N = { xs: 1.5, sm: 2, md: 2.5, lg: 3 };
export const SPINNER_N = { xs: 4, sm: 5, md: 6, lg: 8, xl: 10 };
export const SEPARATOR_N = 8;
export const SPINNER_VALS = {
  "spinner-arc": "25%",
  "spinner-thickness": "25%",
  "mix-spinner-track": "24%",
};

/** Layout gap scale aliases the spacing scale. */
export const GAP_SCALE = ["xs", "sm", "md", "lg", "xl"];

/**
 * Ground tokens that flip in dark. The brand fill roles are background-
 * independent and stay single-valued, derived from the spec. accent flips with
 * the ground; ring/link lighten so they read on a dark surface.
 */
export const GROUND_DARK = {
  background: "oklch(17% 0 0)",
  foreground: "oklch(96% 0 0)",
  accent: "oklch(96% 0 0)",
  "accent-foreground": "oklch(17% 0 0)",
  ring: "oklch(65% 0.19 257.52)",
};

/** Number → clean string (no float artifacts, trailing zeros trimmed). */
const num = (n) => `${+n.toFixed(4)}`;

/** OKLCH spec triple → CSS string, L as a percentage. */
export const oklch = ({ l, c, h }) =>
  `oklch(${num(l * 100)}% ${num(c)} ${num(h)})`;
