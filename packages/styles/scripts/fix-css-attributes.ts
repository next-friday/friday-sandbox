import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const componentsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
  "components",
);

const ARIA_ATTRIBUTES = ["aria-disabled", "aria-expanded", "aria-selected"];

const fixFile = (filePath: string): void => {
  let css = fs.readFileSync(filePath, "utf8");
  let hasChange = false;
  for (const attribute of ARIA_ATTRIBUTES) {
    const bare = new RegExp(String.raw`\[${attribute}\](?!=)`, "g");
    if (bare.test(css)) {
      css = css.replace(bare, () => `[${attribute}="true"]`);
      hasChange = true;
    }
  }
  if (hasChange) fs.writeFileSync(filePath, css);
};

const walk = (directory: string): void => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(entryPath);
    else if (entry.name.endsWith(".css")) fixFile(entryPath);
  }
};

if (fs.existsSync(componentsDirectory)) walk(componentsDirectory);
