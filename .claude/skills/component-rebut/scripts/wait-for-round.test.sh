#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
shim_dir=$(mktemp -d)
trap 'rm -rf "$shim_dir"' EXIT

cat > "$shim_dir/gh" <<'SHIM'
#!/usr/bin/env bash
args="$*"
case "$args" in
  *"repo view"*) printf 'fake/repo\n' ;;
  *"commits/"*) printf '%s\n' "${FAKE_SINCE:-}" ;;
  *"/reviews"*) printf '%b' "${FAKE_REVIEWS:-}" ;;
  *"issues/9/comments"*) printf '%b' "${FAKE_CR_BODY:-}" ;;
  *"pulls/9/comments"*) printf '%b' "${FAKE_INLINE:-}" ;;
  *"pulls/9"*) printf '%s\n' "${FAKE_HEAD:-}" ;;
  *) exit 1 ;;
esac
SHIM
chmod +x "$shim_dir/gh"

pass=0
fail=0
run_case() {
  local name="$1" expect="$2"
  shift 2
  set +e
  PATH="$shim_dir:$PATH" env FAKE_HEAD=abc1234 FAKE_SINCE=2026-07-09T10:00:00Z "$@" \
    bash "$script_dir/wait-for-round.sh" 9 --once >/dev/null 2>&1
  local rc=$?
  set -e
  if [ "$rc" -eq "$expect" ]; then
    echo "✓ $name (exit $rc)"
    pass=$((pass + 1))
  else
    echo "✗ $name — expected exit $expect, got $rc"
    fail=$((fail + 1))
  fi
}

NEW=2026-07-09T11:00:00Z
OLD=2026-07-09T09:00:00Z
RL_NEW="2026-07-09T10:30:00Z\t<!-- rate limited by coderabbit.ai --> Review limit reached\n"
RL_OLD="$OLD\t<!-- rate limited by coderabbit.ai --> Review limit reached\n"

run_case "both reviewed after round start -> complete" 0 \
  FAKE_REVIEWS="$NEW\tcoderabbitai[bot]\tActionable comments posted: 2\n$NEW\tgemini-code-assist[bot]\t## Code Review\n"

run_case "cr review submitted after push, pinned to an old sha -> complete" 0 \
  FAKE_REVIEWS="$NEW\tcoderabbitai[bot]\tActionable comments posted: 1\n$NEW\tgemini-code-assist[bot]\t## Code Review\n"

run_case "cr rate-limited now, gemini done -> exit 5" 5 \
  FAKE_REVIEWS="$NEW\tgemini-code-assist[bot]\t## Code Review\n" \
  FAKE_CR_BODY="$RL_NEW"

run_case "cr rate-limited now, gemini prior-round -> settled 6" 6 \
  FAKE_REVIEWS="$OLD\tgemini-code-assist[bot]\t## Code Review\n" \
  FAKE_CR_BODY="$RL_NEW"

run_case "nobody yet -> waiting 3" 3

run_case "stale rate-limit comment, cr reviewed this round -> complete" 0 \
  FAKE_REVIEWS="$NEW\tcoderabbitai[bot]\tActionable comments posted: 1\n$NEW\tgemini-code-assist[bot]\t## Code Review\n" \
  FAKE_CR_BODY="$RL_OLD"

run_case "stale rate-limit comment alone is not this round's state -> waiting 3" 3 \
  FAKE_CR_BODY="$RL_OLD"

run_case "gemini done, cr silent -> partial 4" 4 \
  FAKE_REVIEWS="$NEW\tgemini-code-assist[bot]\t## Code Review\n"

run_case "both prior-round after fix push -> settled 6" 6 \
  FAKE_REVIEWS="$OLD\tcoderabbitai[bot]\tActionable comments posted: 3\n$OLD\tgemini-code-assist[bot]\t## Code Review\n"

run_case "cr processing placeholder now -> waiting 3" 3 \
  FAKE_CR_BODY="2026-07-09T10:20:00Z\tCurrently processing new changes in this PR.\n"

echo "wait-for-round: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
