#!/usr/bin/env node
// Prose linter for the editorial style guide (STYLE.md).
// Flags banned marketing words, off-vocabulary terms, and missing required
// headings in governed Markdown and MDX. Reads scripts/prose/vocabulary.json.
//
// Usage:
//   node scripts/prose/lint-prose.mjs            # lint, exit 1 on findings
//   node scripts/prose/lint-prose.mjs --report-only  # print, always exit 0
//   node scripts/prose/lint-prose.mjs --selfcheck    # run assertions, exit
//
// ponytail: regex/heading scan, no Vale, no deps. Story copy in *.tsx is
// reviewer-governed, not linted here, since matching string literals is high-FP.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const VOCAB = JSON.parse(readFileSync(join(HERE, "vocabulary.json"), "utf8"));

const word = (w) =>
  new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
const MARKETING = VOCAB.marketing.map((w) => [w, word(w)]);
const TERMS = Object.entries(VOCAB.terms).map(([bad, good]) => [
  bad,
  good,
  word(bad),
]);

// Strip spans that are not prose, so code, links, and JSX never trigger a flag.
function clean(line) {
  return line
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/\]\([^)]*\)/g, "] ") // markdown link target
    .replace(/https?:\/\/\S+/g, " ") // bare URLs
    .replace(/<[^>]+>/g, " ") // JSX/HTML tags
    .replace(/\{[^}]*\}/g, " "); // JSX expressions
}

function lintFile(path) {
  const findings = [];
  const lines = readFileSync(path, "utf8").split("\n");
  const headings = new Set();
  let inFence = false;
  let inFrontmatter = lines[0]?.trim() === "---";

  lines.forEach((raw, i) => {
    const ln = i + 1;
    if (inFrontmatter) {
      if (i > 0 && raw.trim() === "---") inFrontmatter = false;
      return;
    }
    if (/^\s*```/.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    const headingMatch = raw.match(/^#{1,6}\s+(.*?)\s*$/);
    if (headingMatch) headings.add(headingMatch[1].replace(/[`*]/g, "").trim());

    const text = clean(raw);
    for (const [w, re] of MARKETING)
      if (re.test(text))
        findings.push(
          `${path}:${ln}: marketing word "${w}"; describe behavior, not quality`,
        );
    for (const [bad, good, re] of TERMS)
      if (re.test(text))
        findings.push(`${path}:${ln}: term "${bad}"; use "${good}"`);
  });

  const spec = path.endsWith("/index.mdx")
    ? null
    : VOCAB.structure.find((s) => path.includes(s.glob));
  if (spec)
    for (const h of spec.headings)
      if (![...headings].some((x) => x.toLowerCase() === h.toLowerCase()))
        findings.push(`${path}: missing required heading "${h}"`);

  return findings;
}

function targets() {
  const out = execFileSync("git", ["ls-files", "*.md", "*.mdx"], {
    encoding: "utf8",
  });
  return out
    .split("\n")
    .filter(Boolean)
    .filter((p) => !VOCAB.exclude.some((e) => p.includes(e)));
}

function selfcheck() {
  const dir = mkdtempSync(join(tmpdir(), "prose-"));
  const f = (name, body) => {
    const p = join(dir, name);
    writeFileSync(p, body);
    return p;
  };
  const assert = (cond, msg) => {
    if (!cond) {
      console.error(`selfcheck FAIL: ${msg}`);
      process.exit(1);
    }
  };

  assert(
    lintFile(f("a.md", "A powerful button.")).length === 1,
    "marketing word not flagged",
  );
  assert(
    lintFile(f("b.md", "A button for a single action.")).length === 0,
    "clean prose flagged",
  );
  assert(
    lintFile(f("c.md", "Use the `powerful` flag here.")).length === 0,
    "code span flagged",
  );
  assert(
    lintFile(f("d.md", "Use a widget for this.")).length === 1,
    "off-vocabulary term not flagged",
  );
  console.log("selfcheck OK");
  process.exit(0);
}

if (process.argv.includes("--selfcheck")) selfcheck();

const reportOnly = process.argv.includes("--report-only");
const findings = targets().flatMap(lintFile);
if (findings.length) {
  console.error(findings.join("\n"));
  console.error(
    `\nprose: ${findings.length} finding(s)${reportOnly ? " (report-only)" : ""}`,
  );
  process.exit(reportOnly ? 0 : 1);
}
console.log("prose: clean");
