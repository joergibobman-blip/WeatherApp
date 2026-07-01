---
emoji: "🛠️"
description: Triages new issues by implementing requested changes on a branch and opening a pull request
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write
tools:
  cli-proxy: true
  github:
    mode: gh-proxy
    toolsets: [default]
network:
  allowed: [defaults, github, node]
timeout-minutes: 25
safe-outputs:
  create-pull-request:
    draft: true
    if-no-changes: error
    allowed-files:
      - "src/**"
      - "public/**"
      - "*.json"
      - "*.md"
      - "*.html"
      - "*.css"
      - "vite.config.js"
      - "eslint.config.js"
  add-comment:
    max: 1
  noop:
---

# Issue Auto Triage

Automatically triage newly opened issues by preparing a code change and opening a pull request.

## Task

For each newly opened issue:

1. Analyze the issue request and repository context.
2. Create a dedicated feature/fix branch.
3. Implement the requested change in that branch.
4. Validate the updated project with the most relevant checks.
5. Create a pull request targeting the default branch with a clear summary of changes.

## Safe Outputs

- Use `create-pull-request` after changes are complete.
- Use `add-comment` to report what was changed or why work could not proceed.
- Use `noop` with a short reason when the issue is invalid, incomplete, duplicate, or requires no repository change.

## Requirements

- Keep changes focused to the issue scope only.
- Do not include unrelated refactors.
- Use concise PR titles and include issue linkage in the PR body.
- If requirements are ambiguous, request clarification with `add-comment` and stop.
