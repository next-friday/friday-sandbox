// Shared types for the codegen + contrast scripts. The runtime authority is
// formulas.ts and tokens/default.spec.json; these types describe the shapes
// those scripts read so the emitter and validator stay in lock-step.

/** An OKLCH spec triple. `l` is 0..1; the spec always carries an explicit `h`. */
export interface OklchTriple {
  c: number;
  h: number;
  l: number;
}

/** The brand and status roles that own a full interaction ladder. */
export type BrandRole =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "danger";

/**
 * The color block of tokens/default.spec.json. Brand roles plus the ground
 * triples; each value is an OKLCH spec triple.
 */
type SpecColor = Record<BrandRole, OklchTriple> & {
  neutral: OklchTriple;
  background: OklchTriple;
  foreground: OklchTriple;
};

/** The parsed tokens/default.spec.json. */
export interface ThemeSpec {
  color: SpecColor;
  mode: string;
  name: string;
  border?: string;
  fontMono?: string;
  fontSans?: string;
  radius?: string;
}

/** Each brand role's chosen `-foreground` CSS string, keyed by role. */
export type ForegroundMap = Record<BrandRole, string>;

/** A single contrast failure record, bucketed by kind in {@link ValidationResult}. */
export interface ContrastFailure {
  id: string;
  lc: number;
  mode: string;
  wcag: number;
}

/** validateTheme's bucketed failures: solid/text are hard gates, tinted advisory. */
export interface ValidationResult {
  solid: ContrastFailure[];
  text: ContrastFailure[];
  tinted: ContrastFailure[];
}
