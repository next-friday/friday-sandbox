<p align="center">
  <a href="https://github.com/next-friday/friday-sandbox">
    <h1 align="center">Friday UI</h1>
  </a>
</p>

<p align="center">
  Beautiful, ready-made building blocks for your website — friendly for first-time builders, and friendly for AI helpers too.
</p>

<p align="center">
  <a href="https://github.com/next-friday/friday-sandbox/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@friday-sandbox/react?style=flat" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@friday-sandbox/react">
    <img src="https://img.shields.io/npm/dm/@friday-sandbox/react.svg?style=flat-round" alt="npm downloads">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml">
    <img src="https://github.com/next-friday/friday-sandbox/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/next-friday/friday-sandbox">
    <img src="https://img.shields.io/badge/status-production--ready-success?style=flat" alt="Production ready">
  </a>
</p>

## Hello there

Welcome! Friday UI is a kit of polished, ready-to-use pieces — buttons, layout primitives, and more — that you can drop into your project today. Think of it as a box of Lego pieces for the web: each piece is already painted, already fits, and you just choose where it goes.

If you are new to building for the web, you are in the right place. We did the fiddly parts so you can focus on what your site says, looks like, and does.

## Why people like it

- **Looks good out of the box.** Every piece is styled, spaced, and aligned for you — no design degree required.
- **Works for everyone.** Keyboard users, screen-reader users, people on slow phones — accessibility is built in from day one.
- **Easy to make your own.** Want a different color, a rounder shape, your own brand font? A few small changes and Friday UI follows along.
- **Light and fast.** Pages stay quick to load. Visitors do not wait, and search engines notice.
- **Backed by real testing.** Every release is checked automatically before it ships, so what you install is what was tested.

## Friendly for AI helpers

A lot of people now build websites with help from tools like ChatGPT, Claude, Cursor, or Copilot. Friday UI is written in a way those tools understand really well:

- The pieces are easy to read, so an AI helper can explain what each one does in plain language.
- The names follow a clear pattern, so when you ask for "a button" or "a grid", the helper rarely guesses wrong.
- Every piece comes with little examples (called _stories_) showing how it looks in different situations — perfect for "show me how to use this".

If you are pairing with an AI helper, Friday UI is one less thing for both of you to argue about.

## Install

Pick whichever package manager you already have:

```bash
# pnpm
pnpm add @friday-sandbox/react @friday-sandbox/styles

# yarn
yarn add @friday-sandbox/react @friday-sandbox/styles

# npm
npm install @friday-sandbox/react @friday-sandbox/styles
```

> Not sure what a package manager is? Ask your AI helper — it can walk you through it in a minute.

## Try it

Bring in the look-and-feel from your main CSS file:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@friday-sandbox/styles";
```

Then use a piece anywhere on your page:

```tsx
import { Button } from "@friday-sandbox/react";

export function Save() {
  return <Button onPress={() => save()}>Save changes</Button>;
}
```

That is it — you just added a fully accessible, fully styled button to your site.

## What is inside the box

| Package                                                                                             | What it is                                                                   |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`@friday-sandbox/react`](https://github.com/next-friday/friday-sandbox/tree/main/packages/react)   | The pieces themselves — buttons and layout primitives, with more on the way. |
| [`@friday-sandbox/styles`](https://github.com/next-friday/friday-sandbox/tree/main/packages/styles) | The look-and-feel — colors, spacing, and shapes that the pieces share.       |

## See it in action

Friday UI ships with a little playground called **Storybook** — a website that shows every piece in every state (normal, hovered, disabled, loading…) so you can play with it before adding it to your project. The playground is built from `packages/react` and published via [`vercel.json`](https://github.com/next-friday/friday-sandbox/blob/main/vercel.json).

## Helping out

You do not need to be an expert to help. Spotted a typo? Confused by an instruction? Have an idea for a new piece? We would love to hear it. Open an issue, start a discussion, or send a pull request — see [CONTRIBUTING.md](https://github.com/next-friday/friday-sandbox/blob/main/CONTRIBUTING.md) for a gentle walk-through.

Everyone here is expected to follow our [Code of Conduct](https://github.com/next-friday/friday-sandbox/blob/main/CODE_OF_CONDUCT.md) — be kind, be patient, be helpful.

## Security

If you think you have found a security problem, please report it privately through GitHub instead of opening a public issue. Details in [`.github/SECURITY.md`](https://github.com/next-friday/friday-sandbox/blob/main/.github/SECURITY.md).

## License

[Apache-2.0](https://github.com/next-friday/friday-sandbox/blob/main/LICENSE) — free to use, including for commercial projects.
