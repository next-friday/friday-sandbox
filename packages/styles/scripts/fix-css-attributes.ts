import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const componentsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "components",
);

const ARIA_ATTRIBUTES = [
  "aria-disabled",
  "aria-invalid",
  "aria-checked",
  "aria-selected",
  "aria-expanded",
  "aria-pressed",
  "aria-current",
];

const fixFile = (filePath: string): void => {
  let css = fs.readFileSync(filePath, "utf8");
  let hasChange = false;
  for (const attribute of ARIA_ATTRIBUTES) {
    const bare = new RegExp(String.raw`\[${attribute}\](?!=)`, "g");
    if (bare.test(css)) {
      css = css.replace(bare, `[${attribute}="true"]`);
      hasChange = true;
    }
  }
  if (hasChange) fs.writeFileSync(filePath, css);
};

if (fs.existsSync(componentsDirectory)) {
  for (const file of fs.readdirSync(componentsDirectory)) {
    if (file.endsWith(".css")) fixFile(path.join(componentsDirectory, file));
  }
}
