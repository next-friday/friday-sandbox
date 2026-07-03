#!/usr/bin/env bash
set -euo pipefail

pr="${1:-}"
if ! [[ "$pr" =~ ^[0-9]+$ ]]; then
  echo "gather-review: usage: gather-review.sh <pr-number>" >&2
  exit 2
fi

owner_repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) || true
if [ -z "$owner_repo" ]; then
  echo "gather-review: cannot resolve the GitHub repo; run preflight first (is gh authenticated, with a github remote?)." >&2
  exit 1
fi

echo "=== REVIEWS ==="
gh api --paginate "repos/$owner_repo/pulls/$pr/reviews" \
  --jq '.[] | "[\(.user.login)] \(.state)\n\(.body)\n"'

echo "=== COMMENTS ==="
gh api --paginate "repos/$owner_repo/pulls/$pr/comments" \
  --jq '.[] | "[\(.user.login)] \(.path):\(.line // "") id=\(.id)\n\(.body)\n"'
