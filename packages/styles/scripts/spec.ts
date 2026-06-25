// Shared spec loader. Reads tokens/default.spec.json, validates it against
// theme-spec.schema.json with Ajv at build time, and returns the typed spec.
// codegen.ts and validate.ts both go through here, so a spec that violates the
// schema fails the build instead of silently emitting bad CSS. The schema
// declares JSON Schema draft 2020-12, so the loader uses Ajv's 2020 dialect.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import ajvModule from "ajv/dist/2020.js";
import type { ErrorObject } from "ajv/dist/2020.js";

import schema from "../theme-spec.schema.json" with { type: "json" };

import type { ThemeSpec } from "./types.ts";

// Ajv ships CommonJS (`module.exports = Ajv2020`), so under NodeNext the default
// import is the module namespace and the class is its `.default`.
const Ajv2020 = ajvModule.default;

const here = path.dirname(fileURLToPath(import.meta.url));

// strictTypes is off because the status `$defs` narrow `h` through
// `allOf` + `properties` without restating `type`, a valid 2020-12 pattern Ajv's
// strict-type inference flags as a false positive. Range, required, and
// additionalProperties enforcement stay on.
const ajv = new Ajv2020({ strictTypes: false });
const validate = ajv.compile<ThemeSpec>(schema);

/**
 * Render Ajv errors as one diagnostic line each (`/color/primary/h must be <= 360`).
 */
const formatErrors = (errors: ErrorObject[]): string =>
  errors
    .map(
      (error) =>
        `  ${error.instancePath || "/"} ${error.message ?? "is invalid"}`,
    )
    .join("\n");

/**
 * Load and schema-validate the default theme spec. Throws with the Ajv errors
 * listed if the spec is invalid, so the build stops at the source.
 */
export function loadSpec(): ThemeSpec {
  const spec: unknown = JSON.parse(
    readFileSync(path.join(here, "../tokens/default.spec.json"), "utf8"),
  );
  if (!validate(spec)) {
    throw new Error(
      `tokens/default.spec.json fails theme-spec.schema.json:\n${formatErrors(
        validate.errors ?? [],
      )}`,
    );
  }
  return spec;
}
