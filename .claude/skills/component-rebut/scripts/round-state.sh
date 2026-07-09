#!/usr/bin/env bash
set -euo pipefail

PR="${1:?usage: round-state.sh <pr>}"
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

STATE=$(gh pr view "$PR" --json state -q .state)
HEAD=$(gh pr view "$PR" --json headRefOid -q .headRefOid)
SINCE=$(gh api "repos/$REPO/pulls/$PR/commits" --paginate --jq '[.[] | select(.parents | length < 2) | .commit.committer.date] | max // empty')

REVIEWS=$(gh api "repos/$REPO/pulls/$PR/reviews" --paginate)
COMMENTS=$(gh api "repos/$REPO/issues/$PR/comments" --paginate)

cr_state() {
  local review_at walkthrough walkthrough_at limit_at reset ack_at
  review_at=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("Actionable comments posted")) | .submitted_at] | max // empty' <<< "$REVIEWS")
  walkthrough=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("No actionable comments were generated|Actionable comments posted"))] | max_by(.updated_at) | .body // empty' <<< "$COMMENTS")
  walkthrough_at=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("No actionable comments were generated|Actionable comments posted")) | .updated_at] | max // empty' <<< "$COMMENTS")
  limit_at=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("Review limit reached|rate limits")) | .updated_at] | max // empty' <<< "$COMMENTS")
  ack_at=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("Review finished")) | .updated_at] | max // empty' <<< "$COMMENTS")

  if [ -n "$review_at" ] && [[ ! "$review_at" < "$SINCE" ]]; then
    local count
    count=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("Actionable comments posted"))] | max_by(.submitted_at) | .body' <<< "$REVIEWS" | grep -oE "Actionable comments posted: [0-9]+" | grep -oE "[0-9]+" || true)
    if [ "${count:-0}" -eq 0 ]; then echo "reviewed-clean — review for this content, 0 actionable"; else echo "reviewed-findings — $count actionable to triage"; fi
    return
  fi
  if [ -n "$walkthrough_at" ] && [[ ! "$walkthrough_at" < "$SINCE" ]]; then
    if grep -q "No actionable comments were generated" <<< "$walkthrough"; then
      echo "reviewed-clean — walkthrough updated $walkthrough_at, 0 actionable"
    else
      local count
      count=$(grep -oE "Actionable comments posted: [0-9]+" <<< "$walkthrough" | grep -oE "[0-9]+" | head -1 || true)
      echo "reviewed-findings — ${count:-?} actionable to triage (walkthrough $walkthrough_at)"
    fi
    return
  fi
  if [ -n "$limit_at" ] && [[ ! "$limit_at" < "$SINCE" ]]; then
    reset=$(jq -r '[.[] | select(.user.login == "coderabbitai[bot]") | select(.body | test("Review limit reached|rate limits"))] | max_by(.updated_at) | .body' <<< "$COMMENTS" | grep -oE "available in[:*]* *\**[0-9]+ minutes?" | grep -oE "[0-9]+" | head -1 || true)
    echo "rate-limited — no review ran for this content (reset ~${reset:-?} min from that comment; an ack at ${ack_at:-none} is NOT a review)"
    return
  fi
  if [ -n "$review_at$walkthrough_at$limit_at" ]; then
    echo "prior-round — no CodeRabbit activity since this content ($SINCE); not a blocker if threads are answered"
  else
    echo "absent — no CodeRabbit activity"
  fi
}

gemini_state() {
  local review_at abstain_at
  review_at=$(jq -r '[.[] | select(.user.login == "gemini-code-assist[bot]") | .submitted_at] | max // empty' <<< "$REVIEWS")
  abstain_at=$(jq -r '[.[] | select(.user.login == "gemini-code-assist[bot]") | select(.body | test("unable to generate|not being currently supported|not currently supported")) | .updated_at] | max // empty' <<< "$COMMENTS")
  if [ -n "$abstain_at" ] && [[ ! "$abstain_at" < "$SINCE" ]]; then
    echo "abstained — unsupported file types; not a blocker"
  elif [ -n "$review_at" ] && [[ ! "$review_at" < "$SINCE" ]]; then
    echo "reviewed — review submitted $review_at (read its body for findings)"
  elif [ -n "$review_at" ]; then
    echo "prior-round — reviewed $review_at, declined this head; not a blocker"
  else
    echo "absent — no Gemini activity"
  fi
}

summary_state() {
  local posted_at
  posted_at=$(jq -r '[.[] | select(.body | test("Automated triage by Claude Code")) | select(.body | test("Review round")) | .updated_at] | max // empty' <<< "$COMMENTS")
  if [ -n "$posted_at" ] && [[ ! "$posted_at" < "$SINCE" ]]; then
    echo "posted ($posted_at)"
  else
    echo "MISSING — post the step-7 round summary on the PR before any handoff or 'ready' claim"
  fi
}

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

echo "pr        #$PR $STATE"
echo "head      ${HEAD:0:7} ($SINCE)"
echo "coderabbit $(cr_state)"
echo "gemini     $(gemini_state)"
echo "threads    $(bash "$SCRIPT_DIR/verify-coverage.sh" "$PR" | tail -1)"
echo "ci         $(bash "$SCRIPT_DIR/ci-status.sh" "$PR" | tail -1)"
echo "summary    $(summary_state)"
