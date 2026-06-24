// THE single derivation authority. Every ladder rung, geometry step, mix ratio
// and dark value lives here exactly once. Both the CSS emitter (codegen.js)
// and — later — the JS contrast validator read this table, so the formulas can
// never drift between the painted CSS and the validated numbers.

/** Brand roles that own a full interaction ladder. */
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
 * The 12 interaction/emphasis rungs every brand role exposes.
 * kind: how the rung mixes the role color.
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

/** Render one rung to its runtime CSS color-mix string. */
export function ladderValue(role, rung) {
  const r = `var(--${role})`;
  const fg = `var(--${role}-foreground)`;
  const ratio = `var(--${rung.ratio})`;
  switch (rung.kind) {
    case "mixFg":
      return `color-mix(in oklab, ${r}, ${fg} ${ratio})`;
    case "alpha":
      return `color-mix(in oklab, ${r} ${ratio}, transparent)`;
    case "surface":
      return `color-mix(in oklab, ${r} ${ratio}, var(--background))`;
    default:
      throw new Error(`unknown rung kind: ${rung.kind}`);
  }
}

/** Interaction mix ratios shared across every role. */
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

/** Neutral-derived line colors (transparency toward the neutral). */
export const LINE_RATIOS = {
  "mix-border-line": "60%",
  "mix-separator-line": "80%",
};

/** Global scalars consumed by utilities, base and components. */
export const GLOBALS = {
  space: "0.25rem",
  "disabled-opacity": "0.5",
  "ring-width": "2px",
  "ring-offset-width": "1px",
};

/** Geometry step counts per size — the only place these magic ramps live. */
export const BUTTON_N = { xs: 7, sm: 8, md: 10, lg: 11, xl: 12 };
export const SCROLL_N = { xs: 1.5, sm: 2, md: 2.5, lg: 3 };
export const SPINNER_N = { xs: 4, sm: 5, md: 6, lg: 8, xl: 10 };
export const SEPARATOR_N = 8;

export const SCROLL_RATIOS = {
  "mix-scroll-thumb": "40%",
  "mix-scroll-thumb-hover": "65%",
};
export const SPINNER_VALS = {
  "spinner-arc": "25%",
  "spinner-thickness": "25%",
  "mix-spinner-track": "24%",
};

/**
 * Ground tokens that flip between light and dark. value: [light, dark].
 * The brand fill roles (primary…danger) are background-independent and stay
 * single-valued, so they are derived from the spec, not listed here.
 */
export const GROUND_DARK = {
  background: "oklch(17% 0 0)",
  foreground: "oklch(96% 0 0)",
  accent: "oklch(96% 0 0)",
  "accent-foreground": "oklch(17% 0 0)",
  ring: "oklch(65% 0.19 257.52)",
  link: "oklch(70% 0.16 257.52)",
};

/**
 * Surface-family roles (shadcn-compatible vocabulary). Plain primitives, no
 * ladder. [light, dark] — both modes authored.
 */
export const SURFACE_FAMILY = [
  ["muted", "oklch(96.5% 0.005 248.15)", "oklch(25% 0.006 248.15)"],
  ["muted-foreground", "oklch(45% 0.015 248.15)", "oklch(70% 0.015 248.15)"],
  ["card", "oklch(100% 0 0)", "oklch(20% 0 0)"],
  ["card-foreground", "oklch(0% 0 0)", "oklch(96% 0 0)"],
  ["popover", "oklch(100% 0 0)", "oklch(20% 0 0)"],
  ["popover-foreground", "oklch(0% 0 0)", "oklch(96% 0 0)"],
  ["input", "oklch(92% 0.006 248.15)", "oklch(35% 0.006 248.15)"],
];

/** Number → clean string (no float artifacts, trailing zeros trimmed). */
const num = (n) => `${+n.toFixed(4)}`;

/** OKLCH spec triple → CSS string, L as percentage. */
export const oklch = ({ l, c, h }) =>
  `oklch(${num(l * 100)}% ${num(c)} ${num(h)})`;
