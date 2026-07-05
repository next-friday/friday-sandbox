#!/usr/bin/env bash
set -euo pipefail

pr="${1:-}"
mode="${2:-}"
timeout="${WAIT_ROUND_TIMEOUT:-600}"
if ! [[ "$pr" =~ ^[0-9]+$ ]]; then
  echo "wait-for-round: usage: wait-for-round.sh <pr-number> [--once]" >&2
  exit 2
fi

owner_repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) || true
if [ -z "$owner_repo" ]; then
  echo "wait-for-round: cannot resolve the GitHub repo; run preflight first (is gh authenticated, with a github remote?)." >&2
  exit 2
fi

round_status() {
  local head reviews cr_body inline cr_state gem_state
  head=$(gh api "repos/$owner_repo/pulls/$pr" --jq '.head.sha' 2>/dev/null) || head=""
  reviews=$(gh api --paginate "repos/$owner_repo/pulls/$pr/reviews" \
    --jq '.[] | select(.state != "PENDING") | "\(.commit_id)\t\((.user.login // "") | ascii_downcase)\t\(.body[0:80] | gsub("[\n\t]"; " "))"' 2>/dev/null) || reviews=""
  cr_body=$(gh api --paginate "repos/$owner_repo/issues/$pr/comments" \
    --jq '.[] | select((.user.login // "") | ascii_downcase | contains("coderabbit")) | .body' 2>/dev/null) || cr_body=""
  inline=$(gh api --paginate "repos/$owner_repo/pulls/$pr/comments" --jq '.[].id' 2>/dev/null | grep -c . ) || inline=0

  gem_state="absent"
  if printf '%s\n' "$reviews" | awk -F'\t' -v h="$head" '$1 == h && $2 ~ /gemini/ { found = 1 } END { exit !found }'; then
    gem_state="done"
  fi

  cr_state="absent"
  if printf '%s' "$cr_body" | grep -q "Currently processing"; then
    cr_state="processing"
  elif printf '%s\n' "$reviews" | awk -F'\t' -v h="$head" '$1 == h && $2 ~ /coderabbit/ && $3 ~ /Actionable comments posted/ { found = 1 } END { exit !found }' \
    || printf '%s' "$cr_body" | grep -q "Actionable comments posted"; then
    cr_state="done"
  elif [ -n "$cr_body" ] || printf '%s\n' "$reviews" | awk -F'\t' '$2 ~ /coderabbit/ { found = 1 } END { exit !found }'; then
    cr_state="processing"
  fi

  echo "round: coderabbit=$cr_state gemini=$gem_state head=${head:0:7} inline=$inline"
  [ "$cr_state" = "done" ] && [ "$gem_state" = "done" ] && return 0
  { [ "$cr_state" = "done" ] || [ "$gem_state" = "done" ]; } && return 4
  return 3
}

if [ "$mode" = "--once" ]; then
  set +e
  round_status
  rc=$?
  set -e
  exit "$rc"
fi

elapsed=0
while :; do
  set +e
  line=$(round_status)
  rc=$?
  set -e
  echo "[${elapsed}s] $line"
  if [ "$rc" -eq 0 ]; then
    echo "round: complete"
    exit 0
  fi
  if [ "$elapsed" -ge "$timeout" ]; then
    if [ "$rc" -eq 4 ]; then
      echo "round: timeout after ${timeout}s — one reviewer finished; proceed with the posted findings and name the absent reviewer in the round summary"
      exit 4
    fi
    echo "round: timeout after ${timeout}s — no reviewer finished; check the PR and bot config before proceeding"
    exit 3
  fi
  if [ "$elapsed" -lt 180 ]; then
    sleep 20
    elapsed=$((elapsed + 20))
  else
    sleep 45
    elapsed=$((elapsed + 45))
  fi
done
