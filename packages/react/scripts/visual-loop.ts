import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const STORYBOOK_URL = "http://localhost:6006";
const BOOT_ATTEMPTS = 60;
const POLL_INTERVAL_MS = 2000;
const SETTLE_MS = 250;

const packageDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const storybookBinary = path.join(
  packageDirectory,
  "node_modules",
  ".bin",
  "storybook",
);

type IndexEntry = {
  id: string;
  name: string;
  title: string;
  type: string;
};

const fetchStoryIndex = async (): Promise<
  Record<string, IndexEntry> | undefined
> => {
  try {
    const response = await fetch(`${STORYBOOK_URL}/index.json`);
    if (!response.ok) return undefined;
    const payload = (await response.json()) as {
      entries: Record<string, IndexEntry>;
    };
    return payload.entries;
  } catch {
    return undefined;
  }
};

const componentName = process.argv[2];
if (componentName) {
  let entries = await fetchStoryIndex();
  let storybookProcess: ReturnType<typeof spawn> | undefined;

  if (!entries) {
    console.log("visual: booting storybook on :6006");
    storybookProcess = spawn(
      storybookBinary,
      ["dev", "-p", "6006", "--ci", "--quiet"],
      { cwd: packageDirectory, detached: true, stdio: "ignore" },
    );
    for (let attempt = 0; attempt < BOOT_ATTEMPTS && !entries; attempt += 1) {
      await delay(POLL_INTERVAL_MS);
      entries = await fetchStoryIndex();
    }
  }

  if (entries) {
    const stories = Object.values(entries).filter(
      (entry) =>
        entry.type === "story" &&
        entry.title.split("/").at(-1)?.toLowerCase() ===
          componentName.toLowerCase(),
    );

    if (stories.length === 0) {
      const titles = [
        ...new Set(Object.values(entries).map((entry) => entry.title)),
      ];
      console.error(
        `visual: no stories for "${componentName}"; available:\n${titles.join("\n")}`,
      );
      process.exitCode = 1;
    } else {
      const outputDirectory = mkdtempSync(
        path.join(tmpdir(), `visual-${componentName.toLowerCase()}-`),
      );
      const browser = await chromium.launch();
      const page = await browser.newPage();

      for (const story of stories) {
        await page.goto(
          `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`,
        );
        await page.waitForSelector("#storybook-root > *");
        await page.evaluate(() => document.fonts.ready.then(() => void 0));
        await delay(SETTLE_MS);
        const root = page.locator("#storybook-root");
        const imagePath = path.join(
          outputDirectory,
          `${story.id.split("--").at(-1)}.png`,
        );
        await root.screenshot({ path: imagePath });
        console.log(imagePath);
      }

      await browser.close();
      console.log(
        `visual: ${stories.length} stories captured to ${outputDirectory}`,
      );
    }
  } else {
    console.error("visual: storybook did not become ready on :6006");
    process.exitCode = 1;
  }

  if (storybookProcess?.pid) {
    process.kill(-storybookProcess.pid);
  }
} else {
  console.error(
    "usage: pnpm --filter @friday-sandbox/react run visual <component>",
  );
  process.exitCode = 1;
}
