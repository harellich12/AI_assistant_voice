# Jira Automation (Local Script)

This script lets you automatically transition Jira issues based on commit messages.

## Prerequisites
1. Environment variables available (via `apps/api/.env` or shell):
   - `JIRA_BASE_URL`
   - `JIRA_EMAIL`
   - `JIRA_API_TOKEN`
   - `JIRA_PROJECT_KEY`
   - `JIRA_BOARD_ID` (optional but recommended when JQL search is restricted; example: `3`)
2. Jira issues imported already.

## Script
- File: `scripts/jira-sync.mjs`

## Mode 1: Bootstrap key map
Build a map from local ticket IDs (`TKT-001`) to real Jira keys (`XUFL-12`) by matching issue summaries.

```bash
npm run jira:bootstrap-map
```

If JQL returns no results in your Jira tenant, the script will use board issues as fallback when `JIRA_BOARD_ID` is set.

Output map file:
- `docs/stage-3-build/jira-key-map.json`

## Mode 2: Sync transitions from commits
Transitions issues found in commit messages over a range.

Default behavior:
1. Range: `HEAD~1..HEAD`
2. Transition: `Done`
3. Adds a comment to each transitioned issue.

```bash
npm run jira:sync
```

Custom range and transition:

```bash
npm run jira:sync -- --from HEAD~5 --to HEAD --transition "In Progress"
```

Disable comment creation:

```bash
npm run jira:sync -- --comment false
```

## Commit message patterns recognized
1. Jira keys directly: `XUFL-123`
2. Local IDs: `TKT-003` (resolved through `jira-key-map.json`)

## Recommended flow
1. Include Jira key in branch or commit message (`XUFL-123`).
2. Commit code.
3. Run `npm run jira:sync`.

## Notes
1. Transition names must match your Jira workflow states exactly.
2. If transition name is invalid for an issue, script prints available transitions.
