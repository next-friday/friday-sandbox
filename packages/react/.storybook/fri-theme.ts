import { create } from "storybook/theming";

const GROUND = {
  light: {
    bg: "rgba(246, 248, 250, 1)",
    fg: "rgba(14, 18, 22, 1)",
  },
  dark: {
    bg: "rgba(14, 18, 22, 1)",
    fg: "rgba(249, 250, 251, 1)",
  },
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
