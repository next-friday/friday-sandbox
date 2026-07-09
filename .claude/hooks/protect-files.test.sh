#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
repo_root=$(cd "$script_dir/../.." && pwd)
hook="$script_dir/protect-files.sh"

pass=0
fail=0

for name in $(grep -oE '"\$FILE_NAME" == "[^"]+"' "$hook" | grep -oE '== "[^"]+"' | cut -d'"' -f2 | sort -u); do
  if git -C "$repo_root" ls-files "*$name" | grep -q .; then
    echo "✓ protected name exists in tree: $name"
    pass=$((pass + 1))
  else
    echo "✗ protected name matches NOTHING in tree (vacuous protection): $name"
    fail=$((fail + 1))
  fi
done

run_hook() {
  printf '%s' "$1" | bash "$hook" >/dev/null 2>&1
  echo $?
}

blocked=$(run_hook '{"tool_input":{"file_path":"knip.config.ts","new_string":"x"}}')
[ "$blocked" = "2" ] && { echo "✓ knip.config.ts edit blocked"; pass=$((pass + 1)); } || { echo "✗ knip.config.ts edit NOT blocked"; fail=$((fail + 1)); }

suppress=$(run_hook '{"tool_input":{"file_path":"packages/react/src/x.ts","new_string":"// eslint-disable-next-line"}}')
[ "$suppress" = "2" ] && { echo "✓ suppression write blocked"; pass=$((pass + 1)); } || { echo "✗ suppression write NOT blocked"; fail=$((fail + 1)); }

turbo=$(run_hook '{"tool_input":{"file_path":"turbo.json","new_string":"x"}}')
[ "$turbo" = "2" ] && { echo "✓ turbo.json edit blocked"; pass=$((pass + 1)); } || { echo "✗ turbo.json edit NOT blocked"; fail=$((fail + 1)); }

lintstaged=$(run_hook '{"tool_input":{"file_path":".lintstagedrc.json","new_string":"x"}}')
[ "$lintstaged" = "2" ] && { echo "✓ .lintstagedrc.json edit blocked"; pass=$((pass + 1)); } || { echo "✗ .lintstagedrc.json edit NOT blocked"; fail=$((fail + 1)); }

husky=$(run_hook '{"tool_input":{"file_path":".husky/pre-push","new_string":"x"}}')
[ "$husky" = "2" ] && { echo "✓ .husky hook edit blocked"; pass=$((pass + 1)); } || { echo "✗ .husky hook edit NOT blocked"; fail=$((fail + 1)); }

selfhook=$(run_hook '{"tool_input":{"file_path":".claude/hooks/protect-files.sh","new_string":"x"}}')
[ "$selfhook" = "2" ] && { echo "✓ .claude/hooks edit blocked"; pass=$((pass + 1)); } || { echo "✗ .claude/hooks edit NOT blocked"; fail=$((fail + 1)); }

skill=$(run_hook '{"tool_input":{"file_path":".claude/skills/component-implement/SKILL.md","new_string":"x"}}')
[ "$skill" = "0" ] && { echo "✓ skill write allowed"; pass=$((pass + 1)); } || { echo "✗ skill write wrongly blocked"; fail=$((fail + 1)); }

clean=$(run_hook '{"tool_input":{"file_path":"packages/react/src/x.ts","new_string":"export const a = 1;"}}')
[ "$clean" = "0" ] && { echo "✓ clean write allowed"; pass=$((pass + 1)); } || { echo "✗ clean write wrongly blocked"; fail=$((fail + 1)); }

echo "protect-files: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
