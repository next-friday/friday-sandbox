import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { rmSync } from "node:fs";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const run = (file: string, commandArguments: string[]): void => {
  execFileSync(file, commandArguments, {
    cwd: rootDirectory,
    stdio: "inherit",
  });
};

rmSync(path.join(rootDirectory, "dist"), { recursive: true, force: true });
run("node", ["--experimental-strip-types", "scripts/copy-css.ts"]);
run("node", ["--experimental-strip-types", "scripts/fix-css-attributes.ts"]);
run("tailwindcss", [
  "--input",
  "src/index.css",
  "--output",
  "dist/index.css",
  "--minify",
]);
