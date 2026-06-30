import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/components/*/index.ts"],
  dts: true,
  clean: true,
  sourcemap: true,
});
