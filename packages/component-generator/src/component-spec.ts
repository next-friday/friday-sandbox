import { REGISTERED_KINDS } from "./registry";

export type PrimitiveKind = (typeof REGISTERED_KINDS)[number];

export interface Primitive {
  kind: PrimitiveKind;
  part?: string;
  interactive: boolean;
  client: boolean;
}

export interface Axis {
  values: Record<string, string>;
  default?: string;
  boolean?: boolean;
  cascade?: boolean;
  mechanism?: "role" | "paint" | "radius-scale" | "utility" | "stacking";
  prop?: { name: string; map?: Record<string, string> };
}

export type SizeSource =
  { kind: "scale" } | { kind: "ramp"; n: Record<string, number>; md: number };

export interface Layout {
  size: SizeSource;
  radiusArchetype?: "action" | "field" | "box";
}

export interface TokenBinding {
  slot: "background" | "foreground" | "border" | "ring";
  binds: string;
}

export type Behavior =
  { kind: "overlap" } | { kind: "separator-ring"; default: boolean };

export interface Part {
  role: "root" | string;
  element: { wraps: string } | { native: string };
  variants?: Record<string, Axis>;
  tokens?: TokenBinding[];
  layout?: Layout;
  behaviors?: Behavior[];
  spacing?: ("gap" | "padding")[];
  required?: string[];
  manualChildren?: boolean;
}

export interface Asset {
  url: string;
  alt?: string;
}

export interface Prose {
  purpose: string;
  whenToUse: string[];
  whenNotToUse: string[];
}

export interface ComponentSpec {
  schemaVersion: 1;
  name: string;
  primitive: Primitive;
  compound?: "callable-root" | "namespace-of-parts";
  root: Part;
  parts?: Part[];
  assets?: Asset[];
  prose: Prose;
}
