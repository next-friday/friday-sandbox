import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { emit } from "./emit";
import { definedTokens } from "./tokens";

import type { ComponentSpec } from "./component-spec";

const findRepoRoot = (start: string): string => {
  let dir = start;
  while (true) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
};

const main = async (): Promise<void> => {
  const specPath = process.argv[2];
  if (!specPath)
    throw new Error("usage: cli.ts <spec-module-path> [repo-root]");

  const absoluteSpecPath = isAbsolute(specPath)
    ? specPath
    : resolve(process.cwd(), specPath);
  const mod = (await import(pathToFileURL(absoluteSpecPath).href)) as Record<
    string,
    unknown
  >;
  const spec = (mod.default ?? Object.values(mod)[0]) as ComponentSpec;

  const root = process.argv[3] ?? findRepoRoot(process.cwd());
  const defined = definedTokens(root);
  const { files } = emit(spec, defined);

  for (const [path, contents] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
    console.log(target);
  }
};

await main();
