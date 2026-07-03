#!/usr/bin/env bash
set -euo pipefail

pr="${1:-}"
if ! [[ "$pr" =~ ^[0-9]+$ ]]; then
  echo "ci-status: usage: ci-status.sh <pr-number>" >&2
  exit 2
fi

set +e
combined=$(gh pr checks "$pr" 2>&1)
code=$?
set -e

rows=$(printf '%s\n' "$combined" | awk -F'\t' 'NF >= 2 { print }')
if [ -z "$rows" ]; then
  if printf '%s\n' "$combined" | grep -qiE 'no checks reported|no checks on'; then
    echo "ci: none"
    exit 3
  fi
  echo "ci-status: could not read checks for PR $pr (gh exited $code):" >&2
  printf '%s\n' "$combined" >&2
  exit 2
fi

echo "$rows"
states=$(printf '%s\n' "$rows" | awk -F'\t' '{ print $2 }')

if printf '%s\n' "$states" | grep -qiE '^(fail|failing|failure|error|cancel|cancelled|canceled|timed_out)$'; then
  echo "ci: failing"
  exit 1
fi

if printf '%s\n' "$states" | grep -qiE '^(pending|in_progress|queued|waiting|requested)$'; then
  echo "ci: pending"
  exit 4
fi

echo "ci: green"
exit 0
