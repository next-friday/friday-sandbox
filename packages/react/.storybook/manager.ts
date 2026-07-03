import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

// Dark Storybook chrome (sidebar + toolbar) to match the dark-first gallery.
// The canvas and docs page follow the `theme` toolbar global (see preview.tsx).
addons.setConfig({ theme: themes.dark });
