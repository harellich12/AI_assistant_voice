# Jira AAA Board Mapping Guide

Board: `https://danictech.atlassian.net/jira/software/projects/AAA/boards/3`

## 1) What To Import
1. `docs/stage-3-build/jira-AAA-import.csv`
   - Contains epics + stories/tasks mapped to project `AAA`.
2. `docs/stage-3-build/jira-AAA-traceability.csv`
   - Maps planning/design docs to epics/tickets.

## 2) Recommended Import Order
1. Import `jira-AAA-import.csv` once.
2. Verify epics are created with `Epic Name`.
3. Verify stories/tasks are linked via `Epic Link`.
4. Assign to sprints on board after import.

## 3) Jira CSV Field Mapping
When Jira asks for mapping:
1. `Project Key` -> Project Key
2. `Summary` -> Summary
3. `Issue Type` -> Issue Type
4. `Description` -> Description
5. `Priority` -> Priority
6. `Labels` -> Labels
7. `Story Points` -> Story Points
8. `Epic Name` -> Epic Name
9. `Epic Link` -> Epic Link
10. `Components` -> Components
11. `Sprint` -> Sprint (optional, left blank by default)

Optional custom fields:
1. `Original Ticket ID`
2. `Depends On`
3. `Acceptance Criteria`
4. `Source Doc`

## 4) Practical Notes
1. If your Jira project type does not use `Epic Link`, map to `Parent` instead.
2. If `Story Points` field differs (custom numeric field), map it manually.
3. Sprints are intentionally blank in CSV to avoid board-specific sprint-ID mismatches.

## 5) Post-Import Checklist
1. Create or verify components: Platform, Assistant, Tasks, Calendar, Operations, Security, Data, Mobile, Planning, Notifications, Audit, Release.
2. Add imported tickets to Sprint 1/2/3 according to `tickets-stage-3.csv`.
3. Add dependency links from `Depends On` (if not auto-imported).
