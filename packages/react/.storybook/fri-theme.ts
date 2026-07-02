import { create } from "storybook/theming";

// Storybook's create() parses every colour to compute derived shades, so it
// cannot take a CSS var — these mirror the ground tokens by value (light
// --fri-background = oklch(100% 0 0) = #fff, dark = oklch(0% 0 0) = #000; the
// foreground is the inverse) so the docs page matches the component canvas.
const GROUND = {
  light: { bg: "#ffffff", fg: "#000000" },
  dark: { bg: "#000000", fg: "#ffffff" },
} as const;

export const friTheme = (base: "light" | "dark") =>
  create({
    base,
    appBg: GROUND[base].bg,
    appContentBg: GROUND[base].bg,
    appPreviewBg: GROUND[base].bg,
    barBg: GROUND[base].bg,
    textColor: GROUND[base].fg,
  });
