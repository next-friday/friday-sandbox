import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const componentsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
  "components",
);

// Only truly boolean ARIA states — token-valued ones (aria-current, aria-invalid,
// aria-checked, aria-pressed) carry non-"true" values, so a bare selector is valid.
const ARIA_ATTRIBUTES = ["aria-disabled", "aria-expanded", "aria-selected"];

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
