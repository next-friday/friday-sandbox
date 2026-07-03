#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "preflight: gh not found; install the GitHub CLI, then run 'gh auth login'." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "preflight: gh is not authenticated; run 'gh auth login'." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "preflight: git not found; install git." >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "preflight: not inside a git repository." >&2
  exit 1
fi

if ! git remote -v | grep -qE '(@|//|[[:space:]])github\.com[:/]'; then
  echo "preflight: no GitHub remote; add a github.com remote or track this work elsewhere." >&2
  exit 1
fi

echo "preflight: ok"
