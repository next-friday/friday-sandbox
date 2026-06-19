import "@friday-sandbox/styles";

import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import type { Decorator, Preview } from "@storybook/react-vite";

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "light";
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
  return Story();
};

const preview: Preview = {
  decorators: [withTheme],
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Color theme applied to <html data-theme>.",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    options: {
      storySort: {
        order: [
          "Get started",
          "Architecture",
          "Tokens",
          "Theming",
          "Bases",
          "*",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
    chromatic: {
      pauseAnimationAtEnd: true,
      modes: {
        mobile: { viewport: "mobile1" },
        tablet: { viewport: "tablet" },
        desktop: { viewport: "desktop" },
      },
    },
  },
};

export default preview;
