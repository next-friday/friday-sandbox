import type { Demo, DemoContent, DemoNode } from "../component-spec";

interface Asset {
  url: string;
  alt?: string;
}

const INDENT = "  ";

const renderProps = (
  props?: Record<string, string | number | boolean>,
): string =>
  props
    ? Object.entries(props)
        .map(([key, value]) =>
          typeof value === "string"
            ? ` ${key}="${value}"`
            : ` ${key}={${value}}`,
        )
        .join("")
    : "";

const renderLeafContent = (content: DemoContent, assets: Asset[]): string => {
  if ("sample" in content) {
    return `<${content.sample}${renderProps(content.props)} />`;
  }
  if ("text" in content) {
    return content.text;
  }
  const asset = assets[content.asset];
  return `<img src="${asset.url}" alt="${asset.alt ?? ""}" />`;
};

const renderNode = (
  node: DemoNode,
  componentName: string,
  level: number,
  assets: Asset[],
): string => {
  const pad = INDENT.repeat(level);
  if (!node.part) {
    return node.content
      ? `${pad}${renderLeafContent(node.content, assets)}`
      : pad;
  }
  const tag = `${componentName}.${node.part}`;
  const open = `${pad}<${tag}${renderProps(node.props)}`;
  const content = node.content;
  if (content && "asset" in content) {
    const asset = assets[content.asset];
    return `${open} src="${asset.url}" alt="${asset.alt ?? ""}" />`;
  }
  if (content && "text" in content) {
    return `${open}>${content.text}</${tag}>`;
  }
  if (content && "sample" in content) {
    const childPad = INDENT.repeat(level + 1);
    return `${open}>\n${childPad}<${content.sample}${renderProps(content.props)} />\n${pad}</${tag}>`;
  }
  if (node.children && node.children.length > 0) {
    const rendered = node.children
      .map((child) => renderNode(child, componentName, level + 1, assets))
      .join("\n");
    return `${open}>\n${rendered}\n${pad}</${tag}>`;
  }
  return `${open} />`;
};

export const renderCompoundDemo = (
  componentName: string,
  demo: Demo,
  rootAxisProps: string,
  assets: Asset[],
): string => {
  const rootOpenProps = `${rootAxisProps ? ` ${rootAxisProps}` : ""}${renderProps(demo.rootProps ?? {})}`;
  const body = demo.tree
    .map((node) => renderNode(node, componentName, 1, assets))
    .join("\n");
  return `<${componentName}${rootOpenProps}>\n${body}\n</${componentName}>`;
};

export const sampleFixtures = (demo: Demo): string[] => {
  const names = new Set<string>();
  const visit = (node: DemoNode): void => {
    if (node.content && "sample" in node.content) {
      names.add(node.content.sample);
    }
    node.children?.forEach(visit);
  };
  demo.tree.forEach(visit);
  return Array.from(names).sort();
};
