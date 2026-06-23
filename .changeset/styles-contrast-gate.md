---
"@friday-sandbox/styles": minor
---

Add a build-time contrast gate (`scripts/validate.js` with `contrast.js` + `expand.js`, APCA + WCAG via `culori`/`apca-w3`): every brand role's foreground is chosen by APCA at codegen time — a light fill gets dark ink instead of unreadable white — and `pnpm build` fails if any solid-button or core-text pair falls below the APCA floor (label 75 / body 78) or WCAG 4.5. Deepens the default `warning` to a readable amber so its solid button clears the floor. Generated themes — including builder- and AI-authored ones — are always legible; neither HeroUI nor shadcn validates this.
