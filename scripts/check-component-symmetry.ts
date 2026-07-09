import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import ts from "typescript";
import type { AtRule, Declaration, Root } from "postcss";

const REACT_BASES = "packages/react/src/components/bases";
const STYLES_SRC = "packages/styles/src";
const STYLES_COMPONENTS = `${STYLES_SRC}/components`;
const STYLES_THEMES = `${STYLES_SRC}/themes`;
const DOCS = "apps/docs/content/docs/components";

const REACT_INDEX = "packages/react/src/index.ts";
const BASES_INDEX = `${REACT_BASES}/index.ts`;
const STYLES_INDEX = `${STYLES_COMPONENTS}/index.css`;
const THEME_CSS = `${STYLES_SRC}/tailwind/theme.css`;

const REQUIRED_DOC_SECTIONS = [
  "Import",
  "Usage",
  "Purpose",
  "When to use",
  "When not to use",
  "Props",
  "Styling",
];
const LAST_DOC_SECTION = "Accessibility";
const SHOWCASE_BY_AXIS: Record<string, string> = {
  variant: "Variants",
  size: "Sizes",
};

const fails: string[] = [];
const warns: string[] = [];
const fail = (name: string, message: string): void => {
  fails.push(`  ✗ ${name}: ${message}`);
};
const warn = (name: string, message: string): void => {
  warns.push(`  ⚠ ${name}: ${message}`);
};

const pascal = (kebab: string): string =>
  kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const read = (path: string): string =>
  existsSync(path) ? readFileSync(path, "utf8") : "";

const parseTs = (path: string): ts.SourceFile =>
  ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true);

const parseCss = (path: string): Root =>
  postcss.parse(read(path), { from: path });

const lineOf = (sourceFile: ts.SourceFile, node: ts.Node): number =>
  sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

const walk = (node: ts.Node, visit: (child: ts.Node) => void): void => {
  visit(node);
  node.forEachChild((child) => walk(child, visit));
};

const propertyName = (property: ts.ObjectLiteralElementLike): string => {
  if (
    (ts.isPropertyAssignment(property) ||
      ts.isShorthandPropertyAssignment(property) ||
      ts.isMethodDeclaration(property)) &&
    (ts.isIdentifier(property.name) ||
      ts.isStringLiteral(property.name) ||
      ts.isNumericLiteral(property.name))
  ) {
    return property.name.text;
  }
  return "";
};

const objectProp = (
  object: ts.ObjectLiteralExpression,
  name: string,
): ts.Expression | undefined => {
  for (const property of object.properties) {
    if (ts.isPropertyAssignment(property) && propertyName(property) === name) {
      return property.initializer;
    }
  }
  return undefined;
};

const literalText = (node: ts.Expression): string => {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return "true";
  if (node.kind === ts.SyntaxKind.FalseKeyword) return "false";
  return "";
};

const firstTvConfig = (
  sourceFile: ts.SourceFile,
): ts.ObjectLiteralExpression | undefined => {
  let found: ts.ObjectLiteralExpression | undefined;
  walk(sourceFile, (node) => {
    if (
      !found &&
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "tv" &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0]!)
    ) {
      found = node.arguments[0] as ts.ObjectLiteralExpression;
    }
  });
  return found;
};

const objectKeys = (object: ts.Expression | undefined): string[] =>
  object && ts.isObjectLiteralExpression(object)
    ? object.properties.map(propertyName).filter(Boolean)
    : [];

const objectPairs = (
  object: ts.Expression | undefined,
): Map<string, string> => {
  const pairs = new Map<string, string>();
  if (object && ts.isObjectLiteralExpression(object)) {
    for (const property of object.properties) {
      if (ts.isPropertyAssignment(property)) {
        const value = literalText(property.initializer);
        if (value) pairs.set(propertyName(property), value);
      }
    }
  }
  return pairs;
};

const friClasses = (sourceFile: ts.SourceFile, name: string): string[] => {
  const pattern = new RegExp(`^fri-${name}(-[a-z0-9]+)*$`);
  const classes = new Set<string>();
  const duplicates = new Set<string>();
  walk(sourceFile, (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      for (const token of node.text.split(/\s+/)) {
        if (pattern.test(token)) {
          if (classes.has(token)) duplicates.add(token);
          classes.add(token);
        }
      }
    }
  });
  for (const duplicate of duplicates) {
    fail(
      name,
      `duplicate class "${duplicate}" in variants — every value must be distinct`,
    );
  }
  return [...classes].sort();
};

const cssFriClasses = (root: Root, name: string): string[] => {
  const pattern = new RegExp(
    `\\.(fri-${name}(?:-[a-z0-9]+)*)(?![a-z0-9-])`,
    "g",
  );
  const classes = new Set<string>();
  root.walkRules((rule) => {
    for (const match of rule.selector.matchAll(pattern)) classes.add(match[1]!);
  });
  return [...classes].sort();
};

const primaryAxes = (
  tvConfig: ts.ObjectLiteralExpression,
  axes: string[],
): string[] => {
  const slots = objectProp(tvConfig, "slots");
  const primary = objectKeys(slots)[0];
  if (!primary) return axes;
  const variants = objectProp(tvConfig, "variants");
  if (!variants || !ts.isObjectLiteralExpression(variants)) return [];
  const hits: string[] = [];
  for (const axis of variants.properties) {
    if (!ts.isPropertyAssignment(axis)) continue;
    const values = axis.initializer;
    if (!ts.isObjectLiteralExpression(values)) continue;
    const touchesPrimary = values.properties.some(
      (value) =>
        ts.isPropertyAssignment(value) &&
        (ts.isStringLiteral(value.initializer) ||
          (ts.isObjectLiteralExpression(value.initializer) &&
            objectKeys(value.initializer).includes(primary))),
    );
    if (touchesPrimary) hits.push(propertyName(axis));
  }
  return hits;
};

const allTvBases = (sourceFile: ts.SourceFile): string[] => {
  const bases: string[] = [];
  walk(sourceFile, (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "tv" &&
      node.arguments.length > 0 &&
      ts.isObjectLiteralExpression(node.arguments[0]!)
    ) {
      const base = objectProp(
        node.arguments[0] as ts.ObjectLiteralExpression,
        "base",
      );
      if (base) {
        const text = literalText(base);
        if (text) bases.push(text);
      }
    }
  });
  return bases;
};

const storyMeta = (
  sourceFile: ts.SourceFile,
): ts.ObjectLiteralExpression | undefined => {
  let found: ts.ObjectLiteralExpression | undefined;
  walk(sourceFile, (node) => {
    if (
      !found &&
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === "meta" &&
      node.initializer
    ) {
      let initializer: ts.Expression = node.initializer;
      while (
        ts.isSatisfiesExpression(initializer) ||
        ts.isAsExpression(initializer)
      ) {
        initializer = initializer.expression;
      }
      if (ts.isObjectLiteralExpression(initializer)) found = initializer;
    }
  });
  return found;
};

const storyExports = (sourceFile: ts.SourceFile): string[] => {
  const names: string[] = [];
  for (const statement of sourceFile.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          names.push(declaration.name.text);
      }
    }
  }
  return names;
};

const identifiers = (sourceFile: ts.SourceFile): Set<string> => {
  const names = new Set<string>();
  walk(sourceFile, (node) => {
    if (ts.isIdentifier(node)) names.add(node.text);
  });
  return names;
};

const checkStoryJsx = (sourceFile: ts.SourceFile, name: string): void => {
  walk(sourceFile, (node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      node.tagName.text === "div"
    ) {
      fail(
        "div",
        `raw <div> at ${sourceFile.fileName}:${lineOf(sourceFile, node)} — lay out with <Flex>/<Grid> and use samples for placeholders, never a raw <div>`,
      );
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "map" &&
      node.arguments.some((argument) => {
        let hasJsx = false;
        walk(argument, (child) => {
          if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child))
            hasJsx = true;
        });
        return hasJsx;
      })
    ) {
      fail(
        name,
        `.map() builds demo JSX at ${sourceFile.fileName}:${lineOf(sourceFile, node)} — write every showcase case as explicit unrolled JSX (an argTypes options array may map)`,
      );
    }
  });
};

const mdxSections = (text: string): string[] =>
  [...text.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1]!);

const PROPS_TABLE_HEADER = "Prop | Type | Default | Description";

const namespaceParts = (
  sourceFile: ts.SourceFile,
  Pascal: string,
): { callableRoot: boolean; parts: string[] } => {
  let callableRoot = false;
  let parts: string[] = [];
  walk(sourceFile, (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === Pascal &&
      node.initializer
    ) {
      if (ts.isObjectLiteralExpression(node.initializer)) {
        parts = objectKeys(node.initializer);
      } else if (
        ts.isCallExpression(node.initializer) &&
        node.initializer.arguments.length === 2 &&
        ts.isObjectLiteralExpression(node.initializer.arguments[1]!)
      ) {
        callableRoot = true;
        parts = objectKeys(node.initializer.arguments[1] as ts.Expression);
      }
    }
  });
  return { callableRoot, parts };
};

const checkPropsTables = (
  name: string,
  docText: string,
  namespace: { callableRoot: boolean; parts: string[] } | undefined,
  Pascal: string,
): void => {
  const propsSection = /^## Props$([\s\S]*?)(?=^## |\n*$(?![\s\S]))/m.exec(
    docText,
  );
  const sectionText = propsSection?.[1] ?? "";
  for (const line of sectionText.split("\n")) {
    if (!/^\s*\|\s*Prop\b/.test(line)) continue;
    const cells = line
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim())
      .filter(Boolean)
      .join(" | ");
    if (cells !== PROPS_TABLE_HEADER) {
      fail(
        name,
        `Props table header "| ${cells} |" — use the canonical "| ${PROPS_TABLE_HEADER} |" column set`,
      );
    }
  }
  if (!namespace) return;
  const headings = [...sectionText.matchAll(/^###\s+(.+?)\s*$/gm)].map(
    (match) => match[1]!,
  );
  if (namespace.callableRoot && !headings.includes(`${Pascal} Props`)) {
    fail(
      name,
      `compound doc is missing the "### ${Pascal} Props" table for the callable root`,
    );
  }
  for (const part of namespace.parts) {
    if (!headings.includes(`${Pascal}.${part} Props`)) {
      fail(
        name,
        `compound part "${Pascal}.${part}" has no "### ${Pascal}.${part} Props" table in the doc`,
      );
    }
  }
};

const checkDocSpine = (name: string, sections: string[]): void => {
  let previous = -1;
  for (const required of REQUIRED_DOC_SECTIONS) {
    const at = sections.indexOf(required);
    if (at === -1) {
      fail(name, `doc is missing the "${required}" section`);
      continue;
    }
    if (at < previous)
      fail(
        name,
        `doc section "${required}" is out of order — keep the spine order`,
      );
    previous = at;
  }
  const last = sections.at(-1);
  if (last !== LAST_DOC_SECTION) {
    fail(
      name,
      `doc's last section must be "${LAST_DOC_SECTION}", found "${last ?? "none"}"`,
    );
  }
};

const checkMdxContent = (name: string, path: string, text: string): void => {
  const lines = text.split("\n");
  let inFence = false;
  lines.forEach((line, index) => {
    const at = `${path}:${index + 1}`;
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (/\b(STORYBOOK_URL|HEADLESS_DOCS_URL)\b/.test(line)) {
      fail(
        name,
        `scaffold placeholder at ${at} — set the real URL or drop the prop before shipping the doc`,
      );
    }
    const asset = /src="\/([^"]+)"/.exec(line);
    if (asset && !existsSync(`apps/docs/public/${asset[1]}`)) {
      fail(
        name,
        `docs asset "/${asset[1]}" at ${at} has no file under apps/docs/public — add the asset or use a data: URI`,
      );
    }
    if (/<div\b/.test(line) && !/`[^`]*<div/.test(line)) {
      fail(
        "div",
        `raw <div> at ${at} — lay out with <Flex>/<Grid> and use samples for placeholders, never a raw <div>`,
      );
    }
    if (
      /<(span|p|h[1-6]|button)\b/.test(line) &&
      !/`[^`]*<(span|p|h[1-6]|button)/.test(line)
    ) {
      fail(
        "html",
        `raw HTML at ${at} — use <Text> for text/headings, <Button> for a button, <Lorem> for placeholder copy; never a bare <span>/<p>/<h*>/<button>`,
      );
    }
    if (/\.map\(/.test(line) && !/`[^`]*\.map\(/.test(line)) {
      fail(
        name,
        `.map() builds demo JSX at ${at} — write every demo case as explicit unrolled JSX`,
      );
    }
  });
};

const checkApplyOnly = (path: string, root: Root): void => {
  root.walkDecls((declaration: Declaration) => {
    if (!declaration.prop.startsWith("--")) {
      fail(
        "apply",
        `${path.split("/").at(-1)}: raw CSS property — use @apply, or wrap a no-utility property as a @utility in layers/utilities.css (${declaration.prop}: ${declaration.value})`,
      );
    }
  });
};

const reactIndexText = read(REACT_INDEX);
const basesIndexText = read(BASES_INDEX);
const stylesIndexText = read(STYLES_INDEX);

const reactNames = existsSync(REACT_BASES)
  ? readdirSync(REACT_BASES, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];
const cssNames = existsSync(STYLES_COMPONENTS)
  ? readdirSync(STYLES_COMPONENTS)
      .filter((entry) => entry.endsWith(".css") && entry !== "index.css")
      .map((entry) => entry.replace(/\.css$/, ""))
  : [];
const components = [...new Set([...reactNames, ...cssNames])].sort();

let checked = 0;
for (const name of components) {
  const dir = `${REACT_BASES}/${name}`;
  const surfaces = {
    component: `${dir}/${name}.tsx`,
    variants: `${dir}/${name}.styles.ts`,
    index: `${dir}/index.ts`,
    stories: `${dir}/${name}.stories.tsx`,
    css: `${STYLES_COMPONENTS}/${name}.css`,
  };

  let missing = false;
  for (const [label, path] of Object.entries(surfaces)) {
    if (!existsSync(path)) {
      fail(name, `missing ${label} surface ${path}`);
      missing = true;
    }
  }
  if (missing) continue;
  checked += 1;
  const Pascal = pascal(name);

  const variantsFile = parseTs(surfaces.variants);
  const storiesFile = parseTs(surfaces.stories);
  const cssRoot = parseCss(surfaces.css);

  const declared = friClasses(variantsFile, name);
  const cssClasses = cssFriClasses(cssRoot, name);
  for (const cls of declared.filter((entry) => !cssClasses.includes(entry))) {
    fail(
      name,
      `"${cls}" in variants has no rule in ${name}.css (orphan variant)`,
    );
  }
  for (const cls of cssClasses.filter((entry) => !declared.includes(entry))) {
    fail(
      name,
      `".${cls}" in ${name}.css has no variant in ${name}.styles.ts (orphan css)`,
    );
  }

  const pascalPattern = new RegExp(`\\b${Pascal}\\b`);
  if (!pascalPattern.test(basesIndexText))
    fail(name, `${Pascal} not exported from bases/index.ts`);
  if (!pascalPattern.test(reactIndexText))
    fail(name, `${Pascal} not exported from src/index.ts`);
  if (!stylesIndexText.includes(`./${name}.css`)) {
    fail(name, `${name}.css not @import'd in components/index.css`);
  }

  const tvConfig = firstTvConfig(variantsFile);
  const axes = tvConfig ? objectKeys(objectProp(tvConfig, "variants")) : [];
  const meta = storyMeta(storiesFile);
  const controls = meta ? objectKeys(objectProp(meta, "argTypes")) : [];
  const controlAxes = tvConfig ? primaryAxes(tvConfig, axes) : [];
  for (const axis of controlAxes) {
    if (!controls.includes(axis)) {
      fail(
        name,
        `variant axis "${axis}" has no argTypes control in ${name}.stories.tsx`,
      );
    }
  }

  const defaults = tvConfig
    ? objectPairs(objectProp(tvConfig, "defaultVariants"))
    : new Map<string, string>();
  const metaArgs = meta
    ? objectPairs(objectProp(meta, "args"))
    : new Map<string, string>();
  for (const [key, value] of metaArgs) {
    if (defaults.get(key) === value) {
      fail(
        name,
        `meta.args restates the default "${key}: ${value}" — a story shows only content or non-default values, never a default`,
      );
    }
  }

  const namespacePath = `${dir}/${name}.namespace.ts`;
  const namespaceExists = existsSync(namespacePath);
  if (namespaceExists) {
    const namespaceIds = identifiers(parseTs(namespacePath));
    const indexIds = identifiers(parseTs(surfaces.index));
    const componentIds = identifiers(parseTs(surfaces.component));
    const partPattern = new RegExp(`^${Pascal}[A-Z][A-Za-z0-9]*$`);
    for (const part of [...namespaceIds].filter(
      (id) =>
        partPattern.test(id) && id !== `${Pascal}Base` && !id.endsWith("Props"),
    )) {
      if (!indexIds.has(part)) {
        fail(
          name,
          `compound part "${part}" is bundled in ${name}.namespace.ts but not exported from index.ts (dot vs Pascal export asymmetry)`,
        );
      }
      if (!componentIds.has(part)) {
        fail(
          name,
          `compound part "${part}" is bundled in namespace but not defined in ${name}.tsx`,
        );
      }
    }
  }

  const nsInfo = namespaceExists
    ? namespaceParts(parseTs(namespacePath), Pascal)
    : undefined;
  const containsRoot = (partSuffix: string): boolean => {
    const pattern = new RegExp(
      `\\.fri-${name}-${partSuffix}[^,{]*[\\s>+~]\\.fri-${name}(?![a-z0-9-])`,
    );
    let hit = false;
    cssRoot.walkRules((rule) => {
      if (pattern.test(rule.selector)) hit = true;
    });
    return hit;
  };
  const siblingShowcases = nsInfo
    ? allTvBases(variantsFile)
        .map((base) => {
          const match = new RegExp(`^fri-${name}-([a-z0-9-]+)$`).exec(base);
          return match && containsRoot(match[1]!) ? pascal(match[1]!) : "";
        })
        .filter((part) => part && nsInfo.parts.includes(part))
    : [];

  const stories = storyExports(storiesFile);
  if (!stories.includes("Default"))
    fail(name, `${name}.stories.tsx has no Default story`);
  for (const part of siblingShowcases) {
    if (!stories.includes(part)) {
      fail(
        name,
        `independent sibling part "${Pascal}.${part}" (own tv() map) has no ${part} showcase story`,
      );
    }
  }
  for (const axis of axes) {
    const showcase = SHOWCASE_BY_AXIS[axis];
    if (showcase && !stories.includes(showcase)) {
      fail(
        name,
        `axis "${axis}" has no ${showcase} showcase story (the trio: Default/Variants/Sizes)`,
      );
    }
  }

  checkStoryJsx(storiesFile, name);

  const docPath = `${DOCS}/${name}.mdx`;
  if (!existsSync(docPath)) {
    warn(name, `no doc page ${name}.mdx`);
    continue;
  }
  const docText = read(docPath);
  const sections = mdxSections(docText);
  checkDocSpine(name, sections);
  for (const axis of axes) {
    if (!new RegExp(`\\|\\s*\`${axis}\``).test(docText)) {
      fail(name, `variant axis "${axis}" has no row in the doc Props table`);
    }
    const showcase = SHOWCASE_BY_AXIS[axis];
    if (showcase && !sections.includes(showcase)) {
      fail(
        name,
        `axis "${axis}" has no "## ${showcase}" doc section mirroring the ${showcase} story`,
      );
    }
  }
  for (const part of siblingShowcases) {
    if (!sections.includes(part)) {
      fail(
        name,
        `independent sibling part "${Pascal}.${part}" has no "## ${part}" doc section mirroring its showcase story`,
      );
    }
  }
  checkPropsTables(name, docText, nsInfo, Pascal);
  checkMdxContent(name, docPath, docText);
}

const themeFiles = existsSync(STYLES_THEMES)
  ? readdirSync(STYLES_THEMES, { recursive: true })
      .map(String)
      .filter((entry) => entry.endsWith(".css"))
      .map((entry) => join(STYLES_THEMES, entry))
  : [];
const definedTokens = new Set<string>();
for (const path of themeFiles) {
  parseCss(path).walkDecls((declaration: Declaration) => {
    if (declaration.prop.startsWith("--fri-"))
      definedTokens.add(declaration.prop);
  });
}

const stylesCssFiles: string[] = [];
const collectCss = (dir: string): void => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectCss(path);
    else if (entry.name.endsWith(".css")) stylesCssFiles.push(path);
  }
};
collectCss(STYLES_SRC);

const usedTokens = new Set<string>();
for (const path of stylesCssFiles) {
  for (const match of read(path).matchAll(/var\((--fri-[a-z0-9-]+)/g)) {
    usedTokens.add(match[1]!);
  }
}
for (const token of [...usedTokens]
  .filter((entry) => !definedTokens.has(entry))
  .sort()) {
  fail(
    "tokens",
    `var(${token}) referenced but never defined in themes/ (dangling — renamed or typo'd token)`,
  );
}

const themeCssText = read(THEME_CSS);
const appliedUtilities = new Set<string>();
for (const path of readdirSync(STYLES_COMPONENTS)
  .filter((entry) => entry.endsWith(".css"))
  .map((entry) => join(STYLES_COMPONENTS, entry))) {
  parseCss(path).walkAtRules("apply", (atRule: AtRule) => {
    for (const match of atRule.params.matchAll(
      /\b(gap|text-display|text-body|text-label)-(xxsmall|xsmall|small|medium|large|xlarge|2xlarge|3xlarge|4xlarge)(-strong)?\b/g,
    )) {
      appliedUtilities.add(match[0]);
    }
  });
}
for (const utility of [...appliedUtilities].sort()) {
  const key = utility.startsWith("gap-")
    ? `--spacing-${utility.slice(4)}`
    : `--text-${utility.replace(/^text-/, "")}`;
  if (!themeCssText.includes(`${key}:`)) {
    fail(
      "tokens",
      `utility "${utility}" has no @theme entry (${key}) in tailwind/theme.css`,
    );
  }
}

const tailwindThemePath = (() => {
  const pnpmDir = "node_modules/.pnpm";
  if (!existsSync(pnpmDir)) return "";
  for (const entry of readdirSync(pnpmDir)) {
    const candidate = join(
      pnpmDir,
      entry,
      "node_modules/tailwindcss/theme.css",
    );
    if (entry.startsWith("tailwindcss@") && existsSync(candidate))
      return candidate;
  }
  return "";
})();
if (tailwindThemePath) {
  const ours = new Set<string>();
  parseCss(THEME_CSS).walkDecls((declaration: Declaration) => {
    if (declaration.prop.startsWith("--")) ours.add(declaration.prop);
  });
  const tailwind = new Set<string>();
  parseCss(tailwindThemePath).walkDecls((declaration: Declaration) => {
    if (declaration.prop.startsWith("--")) tailwind.add(declaration.prop);
  });
  for (const token of [...ours].filter((entry) => tailwind.has(entry)).sort()) {
    if (token === "--font-sans" || token === "--font-mono") continue;
    fail(
      "tokens",
      `@theme redefines Tailwind's "${token}" — add a new name, don't override (breaks the consumer's native utility)`,
    );
  }
} else {
  warn(
    "tokens",
    "tailwindcss theme.css not found — skipped @theme override check",
  );
}

for (const path of themeFiles) {
  parseCss(path).walkDecls((declaration: Declaration) => {
    if (
      /^--fri-[a-z0-9-]*-(2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|xxl)$/.test(
        declaration.prop,
      )
    ) {
      fail(
        "tokens",
        `token "${declaration.prop}" uses an abbreviated scale suffix — spell it in full (small/medium/…) so it never collides with Tailwind`,
      );
    }
    if (
      (/^--fri-(scale|spacing|radius|display|body|label|caption|code)(-|$)/.test(
        declaration.prop,
      ) ||
        /^--fri-(action|field|box)-radius$/.test(declaration.prop)) &&
      /(^|[\s(])[\d.]+px/.test(declaration.value)
    ) {
      fail(
        "tokens",
        `token "${declaration.prop}" uses a px value ("${declaration.value}") — this family is rem-only so it scales with zoom and user font size`,
      );
    }
  });
}

for (const path of [
  `${STYLES_SRC}/layers/base.css`,
  ...readdirSync(STYLES_COMPONENTS)
    .filter((entry) => entry.endsWith(".css") && entry !== "index.css")
    .map((entry) => join(STYLES_COMPONENTS, entry)),
]) {
  if (existsSync(path)) checkApplyOnly(path, parseCss(path));
}

if (warns.length > 0) {
  console.log(`\nsymmetry warnings:\n${warns.join("\n")}`);
}
if (fails.length > 0) {
  console.error(
    `\ncomponent symmetry FAILED across ${checked} components:\n${fails.join("\n")}`,
  );
  process.exit(1);
}
const note = warns.length > 0 ? `, ${warns.length} warning(s)` : "";
console.log(
  `✓ component symmetry: ${checked} components verified across presence, variants↔css, barrels, controls, stories, story-doc-showcase, sibling-showcase, no-map-demos, docs, docs-assets, props-tables, token resolution, token-units, theme invariants, no-raw-html, apply-only, no-default-args, compound-symmetry${note}`,
);
