import { readFileSync } from "node:fs";
import { join } from "node:path";

import postcss from "postcss";

const TOKEN_FILES = [
  "packages/styles/src/themes/shared/scales.css",
  "packages/styles/src/themes/shared/variables.css",
  "packages/styles/src/themes/default/tokens.css",
];

export const definedTokens = (repoRoot: string): Set<string> => {
  const names = new Set<string>();
  for (const rel of TOKEN_FILES)
    postcss.parse(readFileSync(join(repoRoot, rel), "utf8")).walkDecls((d) => {
      if (d.prop.startsWith("--fri-")) names.add(d.prop);
    });
  return names;
};
