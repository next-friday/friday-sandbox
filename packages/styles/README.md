# @friday-sandbox/styles

Design tokens, themes, and component CSS for `@friday-sandbox/react`. Built on Tailwind CSS v4.

## Install

```sh
pnpm add @friday-sandbox/styles
```

## Usage

### Tailwind v4 app (has build step)

```css
/* app.css */
@import "@friday-sandbox/styles";
```

```ts
// or as a side-effect import in JS
import "@friday-sandbox/styles";
```

### Plain HTML / WordPress / static site (no build step)

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@friday-sandbox/styles/dist/index.css"
/>
```

## Theme switching

Two themes ship: `light` and `dark`. Toggle on `<html>` (or any container) using **class** or **attribute**:

```html
<html data-theme="dark">
  …
</html>
<!-- or -->
<html class="dark">
  …
</html>
```

Default is light. Add the class or attribute to toggle dark.

## Button

```html
<button class="fri-button fri-button-primary fri-button-md">Save</button>
```

| Class                                                                                                       | Required | Pick   |
| ----------------------------------------------------------------------------------------------------------- | -------- | ------ |
| `fri-button`                                                                                                | yes      | —      |
| `fri-button-primary` / `-secondary` / `-accent` / `-neutral` / `-info` / `-success` / `-warning` / `-error` | one      | 1 of 8 |
| `fri-button-xs` / `-sm` / `-md` / `-lg` / `-xl`                                                             | one      | 1 of 5 |

## Customizing colors

Override any of these in your app's CSS. Components compute their own readable text color and hover state from the intent — change the intent and they follow:

```css
:root {
  --primary: oklch(60% 0.2 264);
  --secondary: oklch(60% 0.2 0);
  --accent: oklch(70% 0.14 182);
  --neutral: oklch(40% 0.02 285);
  --info: oklch(60% 0.14 233);
  --success: oklch(58% 0.15 163);
  --warning: oklch(78% 0.18 84);
  --error: oklch(58% 0.22 25);

  --background: light-dark(white, oklch(18% 0.006 285));
  --foreground: light-dark(oklch(21% 0.006 285), oklch(95% 0.006 285));
  --muted: light-dark(oklch(95% 0 0), oklch(28% 0.006 285));
  --muted-foreground: light-dark(oklch(45% 0.006 285), oklch(70% 0.006 285));
}
```

## Browser support

Safari 16.4+, Chrome 119+, Firefox 128+.
