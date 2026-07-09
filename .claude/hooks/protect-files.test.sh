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

clean=$(run_hook '{"tool_input":{"file_path":"packages/react/src/x.ts","new_string":"export const a = 1;"}}')
[ "$clean" = "0" ] && { echo "✓ clean write allowed"; pass=$((pass + 1)); } || { echo "✗ clean write wrongly blocked"; fail=$((fail + 1)); }

echo "protect-files: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
