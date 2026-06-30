import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const componentsDirectory = path.join(rootDirectory, "components");
const outputFile = path.join(rootDirectory, "bundle-size.json");

const sizes: Record<string, { bytes: number; kb: number }> = {};
if (fs.existsSync(componentsDirectory)) {
  for (const file of fs.readdirSync(componentsDirectory).toSorted()) {
    if (file.endsWith(".css") && file !== "index.css") {
      const bytes = fs.statSync(path.join(componentsDirectory, file)).size;
      sizes[file] = { bytes, kb: Math.round((bytes / 1024) * 1000) / 1000 };
    }
  }
}

fs.writeFileSync(outputFile, `${JSON.stringify(sizes, undefined, 2)}\n`);
