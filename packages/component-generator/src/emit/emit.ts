import { emitBarrels } from "./barrels";
import { emitCss } from "./css";
import { kebabCase } from "./helpers";
import { emitMdx } from "./mdx";
import { emitStories } from "./stories";
import { emitStyles } from "./styles";
import { emitTsx } from "./tsx";
import { validateSpec } from "../validate";

import type { ComponentSpec } from "../component-spec";
import type { SpecError } from "../validate";

const formatError = (error: SpecError): string =>
  `${error.spec} (${error.where}): ${error.message}`;

export const emit = (
  spec: ComponentSpec,
  defined: ReadonlySet<string> = new Set(),
): { files: Record<string, string> } => {
  const errors = validateSpec(spec, defined);
  if (errors.length > 0) throw new Error(errors.map(formatError).join("\n"));

  const name = kebabCase(spec.name);
  const reactDir = `packages/react/src/components/bases/${name}`;
  const barrels = emitBarrels(spec);

  const files: Record<string, string> = {
    [`${reactDir}/${name}.tsx`]: emitTsx(spec),
    [`${reactDir}/${name}.styles.ts`]: emitStyles(spec),
    [`${reactDir}/index.ts`]: barrels.index,
    [`${reactDir}/${name}.stories.tsx`]: emitStories(spec),
    [`packages/styles/src/components/${name}.css`]: emitCss(spec),
    [`apps/docs/content/docs/components/${name}.mdx`]: emitMdx(spec),
  };

  if (barrels.namespace !== undefined)
    files[`${reactDir}/${name}.namespace.ts`] = barrels.namespace;

  return { files };
};
