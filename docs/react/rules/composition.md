# Composition and Reuse

**Rule:** Reach for what already exists before writing new behavior. Compose `react-aria-components` for interaction, compose the layout primitives for structure, and extract shared component logic into a hook under `src/` instead of repeating it.

## Why

This is the DRY rule applied across components, not just within one file. A shared hook for focus management, ARIA wiring, or keyboard handling beats re-implementing the same logic in each component: it is written and tested once, every component inherits the same correct behavior, and a fix lands in one place. A re-implementation in a second component is a finding, not a style preference.

## Bad

```tsx
// hand-rolled keyboard + focus that react-aria already provides
const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key === "Enter" || event.key === " ") activate();
};
return (
  <div role="button" tabIndex={0} onKeyDown={onKeyDown} onClick={activate}>
    {/* raw layout that a primitive already owns */}
    <div className="flex items-center gap-2">{children}</div>
  </div>
);
```

## Good

```tsx
import { Button as AriaButton } from "react-aria-components";

import { Flex } from "../../bases/flex";

return (
  <AriaButton onPress={activate}>
    <Flex align="center" gap="sm">
      {children}
    </Flex>
  </AriaButton>
);
```

## How to apply

- Focus, selection, and keyboard behavior come from `react-aria-components`. Do not re-implement what a primitive already handles; flag hand-rolled keyboard logic when an aria primitive exists.
- Shared logic belongs in a reusable hook under `packages/react/src/`: focus management, ARIA wiring, and controlled-vs-uncontrolled state. Two components solving the same problem is the signal to extract.
- For rows, columns, grids, and scrollable regions, compose `Flex`, `Grid`, `GridItem`, `ScrollArea` instead of raw `<div className="flex …">` / `<div className="grid …">`.
