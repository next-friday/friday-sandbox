#!/usr/bin/env bash
set -euo pipefail

repo="${REPO:?REPO is required}"

label() {
  gh label create "$1" --repo "$repo" --color "$2" --description "$3" --force
}

label "type:build" "0052cc" "Build system or external dependencies"
label "type:chore" "0052cc" "Maintenance with no product code change"
label "type:ci" "0052cc" "CI configuration and scripts"
label "type:docs" "0052cc" "Documentation only"
label "type:feat" "0052cc" "A new feature"
label "type:fix" "0052cc" "A bug fix"
label "type:perf" "0052cc" "A performance improvement"
label "type:refactor" "0052cc" "Neither fixes a bug nor adds a feature"
label "type:revert" "0052cc" "Reverts a previous change"
label "type:setup" "0052cc" "Project setup or scaffolding"
label "type:style" "0052cc" "Formatting only, no code-meaning change"
label "type:test" "0052cc" "Adds or corrects tests"

label "status:needs-issue-title-fix" "d93f0b" "Issue title fails the Hybrid Convention"
label "status:stale" "fbca04" "Inactive for 60 days and closing in 14 more"

label "area:react" "ededed" "The @friday-sandbox/react package"
label "area:styles" "ededed" "The @friday-sandbox/styles package"
label "area:eslint-config" "ededed" "The @friday-sandbox/eslint-config package"
label "area:typescript-config" "ededed" "The @friday-sandbox/typescript-config package"
label "area:docs" "ededed" "Documentation and Markdown"
label "area:ci" "ededed" "CI, workflows, and repository config"
label "area:tooling" "ededed" "Build tooling and configuration"

label "dependencies" "0366d6" "Dependency updates from Dependabot"
label "duplicate" "cfd3d7" "This issue or pull request already exists"
label "good first issue" "7057ff" "Good for newcomers"
label "help wanted" "008672" "Extra attention is needed"
label "invalid" "e4e669" "This doesn't seem right"
label "question" "d876e3" "Further information is requested"
label "skip-review" "ededed" "Bot reviewers skip this pull request"
label "wontfix" "ffffff" "This will not be worked on"
