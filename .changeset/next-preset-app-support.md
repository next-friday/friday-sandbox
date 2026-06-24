---
"@friday-sandbox/eslint-config": patch
---

The `next-js` preset now lints real Next.js App Router code cleanly. It ignores the generated `.source` directory and, mirroring the `react-internal` preset, stops `unicorn/prevent-abbreviations` from flagging `props`, `args`, `ref`, and `refs`, plus `params` so Next's `params` argument and `generateStaticParams` export pass without renaming.
