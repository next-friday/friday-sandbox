---
paths:
  - "**/*.{md,mdx}"
---

# Rule: vocabulary — one canonical term per concept

Use the canonical term. Examples:

| Canonical        | Not                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| component        | widget, control, element (when it means a component)                                                             |
| variant          | kind, flavor, style (when it means a `tv()` variant)                                                             |
| token            | theme variable, custom property (when it means a design token)                                                   |
| prop             | option, parameter (when it means a component prop)                                                               |
| size             | sizing, dimension (when it means the `size` prop or token)                                                       |
| gates            | checks, quality checks (when it means the CI and hook verification step)                                         |
| primitive        | base component (when it means the platform tech a component wraps: react-aria-components, radix-ui, native HTML) |
| layout component | primitive (when it means `Flex`, `Grid`, or `Text` — a published component)                                      |
| Tailwind CSS v4  | Tailwind v4, Tailwind 4                                                                                          |
| radix-ui         | radix, Radix (when it means the package)                                                                         |

Words with a distinct technical meaning keep it. `element` for a DOM element and
`property` for a CSS property are correct in their own context; treat the small,
unambiguous set as fixed and the rest as a review judgment against this rule.

Marketing words are banned outright:
powerful, robust, seamless, intuitive, modern, elegant, blazing, effortless,
cutting-edge, world-class, and the like.

Pairs with prose-voice (the narrator these terms speak in) and doc-skeletons
(the structures they fill).
