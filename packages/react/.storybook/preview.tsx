import "@friday-sandbox/styles/css";
import "./preview.css";

import { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Theme tokens from @friday-sandbox/styles",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals }) => {
      useEffect(() => {
        document.documentElement.dataset.theme = globals.theme;
      }, [globals.theme]);

      return <Story />;
    },
  ],
};

export default preview;
