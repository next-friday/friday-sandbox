#!/usr/bin/env bash
set -euo pipefail

name="${1:?usage: verify-component.sh <component-kebab-name>}"

[ -f package.json ] && [ -d packages/react ] || {
  echo "run from the repo root" >&2
  exit 2
}

pnpm --filter @friday-sandbox/react exec vitest run "$name"
pnpm --filter @friday-sandbox/react exec tsc --noEmit
pnpm --filter @friday-sandbox/styles exec tsc --noEmit
pnpm --filter @friday-sandbox/react exec eslint "src/components/bases/$name" --max-warnings 0
pnpm lint:symmetry

echo "✓ $name verified: stories, types (react + styles), eslint, symmetry"
