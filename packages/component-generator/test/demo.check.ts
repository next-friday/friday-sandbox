import assert from "node:assert";
import { renderCompoundDemo, sampleFixtures } from "../src/emit/demo";
import type { Demo } from "../src/component-spec";

const AVATAR: Demo = {
  tree: [
    { part: "Image", content: { asset: 0 } },
    { part: "Fallback", content: { text: "JD" } },
  ],
};
const SCROLL: Demo = {
  rootProps: { className: "h-72" },
  tree: [
    { part: "Viewport", content: { sample: "Lorem", props: { paragraph: 9 } } },
    {
      part: "Scrollbar",
      props: { orientation: "vertical" },
      children: [{ part: "Thumb" }],
    },
    { part: "Corner" },
  ],
};
const GRID: Demo = {
  tree: [{ content: { sample: "Boxes", props: { count: 3 } } }],
};
const ASSETS = [{ url: "https://x/a.png", alt: "A" }];

const avatar = renderCompoundDemo("Avatar", AVATAR, "", ASSETS);
assert.ok(
  avatar.includes('<Avatar.Image src="https://x/a.png" alt="A" />'),
  "avatar image",
);
assert.ok(
  avatar.includes("<Avatar.Fallback>JD</Avatar.Fallback>"),
  "avatar fallback",
);
assert.ok(!avatar.includes(".map("), "no map");

const scroll = renderCompoundDemo("ScrollArea", SCROLL, 'size="md"', []);
assert.ok(
  scroll.includes('<ScrollArea size="md" className="h-72">'),
  "scroll root",
);
assert.ok(scroll.includes("<Lorem paragraph={9} />"), "scroll lorem");
assert.ok(
  scroll.includes('<ScrollArea.Scrollbar orientation="vertical">'),
  "scroll bar",
);
assert.ok(scroll.includes("<ScrollArea.Thumb />"), "scroll thumb");
assert.ok(scroll.includes("<ScrollArea.Corner />"), "scroll corner");

const grid = renderCompoundDemo("Grid", GRID, "", []);
assert.ok(grid.includes("<Boxes count={3} />"), "grid boxes");

assert.deepEqual(sampleFixtures(SCROLL), ["Lorem"]);
assert.deepEqual(sampleFixtures(GRID), ["Boxes"]);
assert.deepEqual(sampleFixtures(AVATAR), []);

console.log("demo.check ✓");
