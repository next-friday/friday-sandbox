// Unit checks for the derivation engine. Run: `node --test scripts/formulas.test.ts`.
// The engine is the single source of truth for every token formula; these pin
// the --fri-* naming, the `color-mix(in oklab, …)` shape, and the derive-from-
// ground model so the emitted CSS can never silently drift.

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  BRAND_ROLES,
  LADDER,
  ladder,
  surface,
  textTier,
  borderTier,
  SIZE_ARCHETYPE,
  SPACING_SCALE,
  oklch,
} from "./formulas.ts";

test("every token name is --fri-* prefixed and mixes in oklab", () => {
  for (const role of BRAND_ROLES) {
    for (const rung of LADDER) {
      const css = ladder(role, rung.suffix);
      assert.match(
        css,
        /^color-mix\(in oklab, /,
        `${role}-${rung.suffix} mixes in oklab`,
      );
      assert.match(
        css,
        /var\(--fri-/,
        `${role}-${rung.suffix} references --fri-* tokens`,
      );
      assert.doesNotMatch(
        css,
        /var\(--(?!fri-)/,
        `${role}-${rung.suffix} has no unprefixed var`,
      );
    }
  }
});

test("solid hover mixes the role toward its foreground by the shared ratio var", () => {
  assert.equal(
    ladder("primary", "hover"),
    "color-mix(in oklab, var(--fri-primary), var(--fri-primary-foreground) var(--fri-mix-hover))",
  );
});

test("surfaces derive from the ground so a --fri-background override reflows them", () => {
  assert.equal(surface("card"), "var(--fri-background)");
  assert.equal(surface("popover"), "var(--fri-background)");
  assert.equal(
    surface("fill"),
    "color-mix(in oklab, var(--fri-background), var(--fri-neutral) 5%)",
  );
  assert.equal(
    surface("fill-strong"),
    "color-mix(in oklab, var(--fri-background), var(--fri-neutral) 10%)",
  );
  assert.equal(surface("inverse"), "var(--fri-foreground)");
  assert.equal(
    surface("overlay"),
    "color-mix(in oklab, black 50%, transparent)",
  );
});

test("text tiers fade the foreground toward the background", () => {
  assert.equal(
    textTier("muted"),
    "color-mix(in oklab, var(--fri-foreground), var(--fri-background) 40%)",
  );
  assert.equal(
    textTier("faint"),
    "color-mix(in oklab, var(--fri-foreground), var(--fri-background) 60%)",
  );
});

test("border tiers fade the neutral toward transparent", () => {
  assert.equal(
    borderTier("strong"),
    "color-mix(in oklab, var(--fri-neutral), transparent 40%)",
  );
  assert.equal(
    borderTier("default"),
    "color-mix(in oklab, var(--fri-neutral), transparent 60%)",
  );
  assert.equal(
    borderTier("subtle"),
    "color-mix(in oklab, var(--fri-neutral), transparent 80%)",
  );
});

test("spacing is a regular t-shirt scale with no semantic outliers", () => {
  assert.equal(SPACING_SCALE["2xs"], "0.125rem");
  assert.equal(SPACING_SCALE.lg, "1rem");
  assert.equal(SPACING_SCALE["4xl"], "4rem");
  assert.ok(!("base" in SPACING_SCALE) && !("section" in SPACING_SCALE));
});

test("size archetypes are concrete block-axis dimensions, role-led", () => {
  assert.deepEqual(Object.keys(SIZE_ARCHETYPE), [
    "action",
    "field",
    "box",
    "feedback",
  ]);
  // size archetypes are concrete block-axis dimensions, not a collapsed single token
  assert.ok(Object.values(SIZE_ARCHETYPE).every((s) => s.endsWith("rem")));
});

test("oklch triple renders L as a percentage", () => {
  assert.equal(
    oklch({ l: 0.5749, c: 0.2084, h: 257.52 }),
    "oklch(57.49% 0.2084 257.52)",
  );
});
