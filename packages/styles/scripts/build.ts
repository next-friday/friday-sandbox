import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const run = (command: string): void => {
  execSync(command, { cwd: rootDirectory, stdio: "inherit" });
};

rmSync(path.join(rootDirectory, "dist"), { recursive: true, force: true });
run("rollup -c rollup.config.mjs");
run("tsc -p tsconfig.build.json");
run("node --experimental-strip-types scripts/copy-css.ts");
run("node --experimental-strip-types scripts/fix-css-attributes.ts");
run("tailwindcss --input index.css --output dist/index.css --minify");
