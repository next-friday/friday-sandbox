import "@friday-sandbox/styles/css";
import "./preview.css";

import { DocsContainer } from "@storybook/addon-docs/blocks";
import { useEffect } from "react";

import type { DocsContainerProps } from "@storybook/addon-docs/blocks";

import type { Preview } from "@storybook/react-vite";
import type { PropsWithChildren } from "react";

import { friTheme } from "./fri-theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // The `theme` toolbar global drives the canvas background through
    // --fri-background (base.css on the html), so the competing backgrounds
    // addon would just paint a grey layer over it — turn it off.
    backgrounds: { disable: true },
    // Sync the docs chrome (headings, args table, canvas frame) with the `theme`
    // toolbar global that drives the component tokens, so the whole docs page —
    // not just the rendered component — follows light/dark.
    docs: {
      container: ({
        children,
        context,
      }: PropsWithChildren<DocsContainerProps>) => {
        const base =
          context.store.userGlobals.globals.theme === "dark" ? "dark" : "light";
        const theme = friTheme(base);

        return (
          <DocsContainer context={context} theme={theme}>
            {children}
          </DocsContainer>
        );
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
