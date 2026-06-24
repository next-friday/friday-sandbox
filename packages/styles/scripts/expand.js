// Numeric color expansion for the contrast validator. Mirrors the CSS the
// codegen emits — same oklab interpolation as `color-mix(in oklab, …)`, same
// alpha compositing the browser performs — so the validated numbers match the
// painted pixels. Reuses the spec + formula ratios; no color math lives twice.

import { converter, clampChroma, interpolate } from "culori";
import { MIX_RATIOS, GROUND_DARK } from "./formulas.js";

const toRgb = converter("rgb");

/** spec {l,c,h} (l in 0..1) → culori oklch object. */
export const specColor = ({ l, c, h }) => ({ mode: "oklch", l, c, h: h || 0 });

/** Ratio string "12%" → 0.12. */
const pct = (s) => Number.parseFloat(s) / 100;

/** Gamut-map to sRGB (browsers paint the clamped color; APCA needs it). */
export const inGamut = (col) => clampChroma(col, "oklch");

/** color-mix(in oklab, A, B t) on opaque colors → oklab interpolation. */
const mixOklab = (a, b, t) => interpolate([a, b], "oklab")(t);

/**
 * An alpha tint — color-mix(in oklab, X r%, transparent) — painted over a
 * backdrop. The browser composites alpha in sRGB, so we do too.
 */
const overBackdrop = (x, backdrop, alpha) => {
  const xr = toRgb(inGamut(x));
  const br = toRgb(inGamut(backdrop));
  return {
    mode: "rgb",
    r: br.r * (1 - alpha) + xr.r * alpha,
    g: br.g * (1 - alpha) + xr.g * alpha,
    b: br.b * (1 - alpha) + xr.b * alpha,
  };
};

/** sRGB color → [r,g,b] 0..255 for apca-w3. */
export const to255 = (col) => {
  const c = toRgb(inGamut(col));
  return [c.r, c.g, c.b].map((v) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255),
  );
};

/** Page background per mode (light = spec, dark = formulas GROUND_DARK). */
export function pageBackground(spec, mode) {
  return mode === "dark"
    ? GROUND_DARK.background
    : specColor(spec.color.background);
}

/**
 * Resolve a brand role's fill color in a given mode. Brand roles are
 * single-valued (background-independent) except accent, which flips with the
 * ground — matching codegen's dark-block emission.
 */
export function roleFill(spec, role, mode) {
  if (role === "accent") {
    return mode === "dark" ? GROUND_DARK.accent : specColor(spec.color.accent);
  }
  return specColor(spec.color[role]);
}

/**
 * The fill backgrounds a button variant paints, per role × mode. `solid` shows
 * the role; tinted variants composite over the page background.
 */
export function variantBackgrounds(spec, role, mode) {
  const fill = roleFill(spec, role, mode);
  const bg = pageBackground(spec, mode);
  return {
    solid: inGamut(fill),
    subtle: overBackdrop(fill, bg, pct(MIX_RATIOS["mix-soft"])),
    surface: mixOklab(
      typeof bg === "string" ? bg : inGamut(bg),
      inGamut(fill),
      pct(MIX_RATIOS["mix-surface"]),
    ),
    outline: bg,
    ghost: bg,
    plain: bg,
  };
}
