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

set +e
required=$(gh pr checks "$pr" --required 2>&1)
set -e
req_rows=$(printf '%s\n' "$required" | awk -F'\t' 'NF >= 2 { print }')

gated_re='^(Publish preview package|UI Review|UI Tests|SonarQube|Sonar)'

scope="all"
verdict_rows="$rows"
if [ -n "$req_rows" ]; then
  scope="required"
  verdict_rows="$req_rows"
  req_names=$(printf '%s\n' "$req_rows" | awk -F'\t' '{ print $1 }')
  info=$(printf '%s\n' "$rows" \
    | awk -F'\t' 'tolower($2) ~ /^(fail|failing|failure|error|cancel|cancelled|canceled|timed_out)$/ { print $1 }' \
    | grep -vxF -f <(printf '%s\n' "$req_names") || true)
  [ -n "$info" ] && echo "non-required failing (informational): $(printf '%s' "$info" | tr '\n' ' ')"
else
  gated=$(printf '%s\n' "$rows" | awk -F'\t' -v re="$gated_re" '$1 ~ re { print $1 " (" $2 ")" }')
  if [ -n "$gated" ]; then
    scope="core"
    verdict_rows=$(printf '%s\n' "$rows" | awk -F'\t' -v re="$gated_re" '$1 !~ re { print }')
    echo "secret- or human-gated (informational, non-blocking): $(printf '%s' "$gated" | tr '\n' ' ')"
  fi
fi

states=$(printf '%s\n' "$verdict_rows" | awk -F'\t' '{ print $2 }')

if printf '%s\n' "$states" | grep -qiE '^(fail|failing|failure|error|cancel|cancelled|canceled|timed_out)$'; then
  echo "ci: failing ($scope)"
  exit 1
fi

if printf '%s\n' "$states" | grep -qiE '^(pending|in_progress|queued|waiting|requested)$'; then
  echo "ci: pending ($scope)"
  exit 4
fi

echo "ci: green ($scope)"
exit 0
