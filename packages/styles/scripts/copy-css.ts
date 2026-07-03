import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distributionDirectory = path.join(rootDirectory, "dist");

const copyCssDirectory = (directoryName: string): void => {
  const sourceDirectory = path.join(rootDirectory, "src", directoryName);
  if (!fs.existsSync(sourceDirectory)) return;
  for (const file of fs.readdirSync(sourceDirectory)) {
    const sourcePath = path.join(sourceDirectory, file);
    const distributionPath = path.join(
      distributionDirectory,
      directoryName,
      file,
    );
    if (fs.statSync(sourcePath).isDirectory()) {
      copyCssDirectory(path.join(directoryName, file));
    } else if (file.endsWith(".css")) {
      fs.mkdirSync(path.dirname(distributionPath), { recursive: true });
      fs.copyFileSync(sourcePath, distributionPath);
    }
  }
};

fs.mkdirSync(distributionDirectory, { recursive: true });
for (const directory of ["components", "layers", "tailwind", "themes"]) {
  copyCssDirectory(directory);
}
