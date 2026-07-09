#!/usr/bin/env bash
set -euo pipefail

pr="${1:-}"
if ! [[ "$pr" =~ ^[0-9]+$ ]]; then
  echo "verify-coverage: usage: verify-coverage.sh <pr-number>" >&2
  exit 2
fi

owner_repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) || true
me="${TRIAGE_LOGIN:-}"
if [ -z "$me" ]; then
  me=$(gh api user --jq .login 2>/dev/null) || true
fi
if [ -z "$owner_repo" ] || [ -z "$me" ]; then
  echo "verify-coverage: cannot resolve the GitHub repo or the triage account; set TRIAGE_LOGIN (e.g. the app's slug[bot]) under an App token, or run preflight for a personal token." >&2
  exit 2
fi

findings=$(gh api --paginate "repos/$owner_repo/pulls/$pr/comments" \
  --jq '.[] | select(.in_reply_to_id == null and .user.login != "'"$me"'") | "\(.id)\t\(.path):\(.line // "")\t\(.user.login)"')

replied=$(gh api --paginate "repos/$owner_repo/pulls/$pr/comments" \
  --jq '.[] | select(.in_reply_to_id != null and .user.login == "'"$me"'") | .in_reply_to_id')

total=0
answered=0
missing=0
while IFS=$'\t' read -r id loc login; do
  [ -n "$id" ] || continue
  total=$((total + 1))
  if printf '%s\n' "$replied" | grep -qx "$id"; then
    echo "answered  $loc ($login) id=$id"
    answered=$((answered + 1))
  else
    echo "MISSING   $loc ($login) id=$id"
    missing=$((missing + 1))
  fi
done <<EOF
$findings
EOF

echo "answered $answered / $total"
[ "$missing" -eq 0 ] || exit 1
