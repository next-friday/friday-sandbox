// Contrast pipeline. Chooses each brand role's foreground by APCA at build time
// (so e.g. a light-yellow warning gets dark ink, not white), and validates every
// rendered pair — solid, tinted, and core text — in both light and dark, against
// the actually-painted, gamut-mapped color. Reuses expand.js + formulas.js.

import { APCAcontrast, sRGBtoY } from "apca-w3";
import { wcagContrast } from "culori";
import { BRAND_ROLES, GROUND_DARK } from "./formulas.js";
import {
  specColor,
  to255,
  inGamut,
  pageBackground,
  roleFill,
  variantBackgrounds,
} from "./expand.js";

const MODES = ["light", "dark"];
const TINTED = ["subtle", "surface", "outline", "ghost", "plain"];

// APCA body floor 78 — a 3-point margin over the 75 readability threshold to
// absorb CSS color-mix ↔ JS ΔE drift. WCAG 2.x secondary compliance floor 4.5.
export const APCA_BODY = 78;
// Button labels are semibold UI text, not body paragraphs — APCA's label floor,
// not the stricter body floor.
const APCA_LABEL = 75;
export const WCAG_MIN = 4.5;

/** APCA Lc magnitude (sign-agnostic: light-on-dark and dark-on-light both count). */
const lc = (text, bg) =>
  Math.abs(Number(APCAcontrast(sRGBtoY(to255(text)), sRGBtoY(to255(bg)))) || 0);
const wcag = (text, bg) => wcagContrast(inGamut(text), inGamut(bg)) || 0;

// Foreground candidates: paper white and near-black ink.
const FG = {
  white: { str: "oklch(100% 0 0)", col: { mode: "oklch", l: 1, c: 0, h: 0 } },
  ink: { str: "oklch(18% 0 0)", col: { mode: "oklch", l: 0.18, c: 0, h: 0 } },
};

/** Pick the foreground with the strongest APCA against a fill. */
function pickForeground(fill) {
  const f = inGamut(fill);
  const white = lc(FG.white.col, f);
  const ink = lc(FG.ink.col, f);
  return ink > white ? { ...FG.ink, lc: ink } : { ...FG.white, lc: white };
}

/**
 * Each brand role's foreground (light-mode fill; brand roles are single-valued
 * so it holds in dark). Returns { role: "oklch(…)" } for the codegen.
 */
export function chooseForegrounds(spec) {
  const out = {};
  for (const role of BRAND_ROLES)
    out[role] = pickForeground(roleFill(spec, role, "light")).str;
  return out;
}

/**
 * Validate every rendered pair. Returns failures bucketed by kind:
 *   solid — chosen ink on the role fill (auto-repaired; must pass = hard gate)
 *   text  — foreground/muted on the page background (hard gate)
 *   tinted — the role color used AS TEXT on its own tint/page (advisory: a
 *            failure here means the role itself is too light for text and needs
 *            a spec change, not a foreground tweak)
 */
export function validateTheme(spec) {
  const fail = { solid: [], text: [], tinted: [] };
  const check = (bucket, id, mode, text, bg) => {
    const a = lc(text, bg);
    const w = wcag(text, bg);
    const floor = bucket === "solid" ? APCA_LABEL : APCA_BODY;
    if (a < floor || w < WCAG_MIN)
      fail[bucket].push({ id, mode, lc: +a.toFixed(1), wcag: +w.toFixed(2) });
  };

  for (const mode of MODES) {
    const bg = pageBackground(spec, mode);
    const fg =
      mode === "dark"
        ? GROUND_DARK.foreground
        : specColor(spec.color.foreground);
    check("text", "foreground", mode, fg, bg);
    const muted = mode === "dark" ? GROUND_DARK["muted-foreground"] : undefined;
    if (muted) check("text", "muted-foreground", mode, muted, bg);
  }

  for (const role of BRAND_ROLES) {
    for (const mode of MODES) {
      const bgs = variantBackgrounds(spec, role, mode);
      const fill = roleFill(spec, role, mode);
      const ink = pickForeground(inGamut(fill)).col;
      check("solid", `${role}.solid`, mode, ink, bgs.solid);
      for (const v of TINTED)
        check("tinted", `${role}.${v}`, mode, fill, bgs[v]);
    }
  }
  return fail;
}
