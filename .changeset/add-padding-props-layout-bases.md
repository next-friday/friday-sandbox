---
"@friday-sandbox/react": major
"@friday-sandbox/styles": major
---

Add padding props to `Flex`, `Grid`, and `GridItem`, and move gap onto the same shared spacing scale. Both now run the nine-step scale (`xxs` to `4xl`): padding through `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl`; gap through `gap`, `gapX`, `gapY`. They are backed by shared `fri-p-*` and `fri-gap-*` utility classes in `@friday-sandbox/styles` that any component or hand-authored markup can consume.

BREAKING CHANGE: the per-component gap classes `fri-flex-gap-*` and `fri-grid-gap-*` are removed; gap now emits the shared `fri-gap-*` classes. The `gap`, `gapX`, and `gapY` props are unchanged and gain four values (`xxs`, `2xl`, `3xl`, `4xl`).
