import { create } from "storybook/theming";

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
