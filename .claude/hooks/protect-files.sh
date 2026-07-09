#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(jq -r '.tool_input.file_path // empty' <<< "$INPUT")
FILE_NAME=$(basename "$FILE_PATH")
NEW_CONTENT=$(jq -r '[.tool_input.content, .tool_input.new_string, (.tool_input.edits[]?.new_string)] | map(select(. != null)) | join("\n")' <<< "$INPUT")

if [[ "$FILE_NAME" == "pnpm-lock.yaml" ]]; then
  echo "Cannot edit protected lock file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "eslint.config.mjs" ]]; then
  echo "Cannot edit protected eslint file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_PATH" =~ (^|/)packages/eslint-config/src/ ]]; then
  echo "Cannot edit protected eslint preset: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "knip.config.ts" ]]; then
  echo "Cannot edit protected knip file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == ".prettierrc.json" || "$FILE_NAME" == ".prettierignore" ]]; then
  echo "Cannot edit protected prettier file: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_NAME" == "turbo.json" || "$FILE_NAME" == ".lintstagedrc.json" ]]; then
  echo "Cannot edit protected gate config: $FILE_NAME" >&2
  exit 2
fi

if [[ "$FILE_PATH" =~ (^|/)(\.husky|\.claude/hooks)/ ]]; then
  echo "Cannot edit protected hook: $FILE_PATH" >&2
  exit 2
fi

if [[ "$FILE_PATH" =~ (^|/)(\.git|node_modules|dist|coverage)/ ]]; then
  echo "Cannot edit file in generated or protected directory: $FILE_PATH" >&2
  exit 2
fi

if [[ "$FILE_PATH" =~ ^(.*/)?(packages|apps)/.*\.(ts|tsx|mjs|cjs|css)$ ]]; then
  if grep -Eq 'eslint-disable|@ts-(expect-error|ignore|nocheck)|stylelint-disable|prettier-ignore|biome-ignore' <<< "$NEW_CONTENT"; then
    echo "Refusing to introduce a lint/type suppression into $FILE_NAME. Fix the underlying error; do not suppress the gate." >&2
    exit 2
  fi
fi

exit 0
