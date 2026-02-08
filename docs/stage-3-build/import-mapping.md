# Jira/Linear Import Mapping

Use `tickets-stage-3.csv` as the source file and map fields as follows.

## 1) CSV Columns
1. `ticket_id`
2. `title`
3. `description`
4. `type`
5. `priority`
6. `status`
7. `estimate_points`
8. `sprint`
9. `component`
10. `owner_role`
11. `depends_on`
12. `acceptance_criteria`

## 2) Jira Mapping
1. `title` -> Summary
2. `description` -> Description
3. `type` -> Issue Type
4. `priority` -> Priority
5. `status` -> Status
6. `estimate_points` -> Story Points
7. `sprint` -> Sprint
8. `component` -> Component/s
9. `depends_on` -> Issue Links (blocks/is blocked by) after import
10. `acceptance_criteria` -> Description section (or custom field)

## 3) Linear Mapping
1. `title` -> Title
2. `description` -> Description
3. `type` -> Issue Label or Type
4. `priority` -> Priority
5. `status` -> State
6. `estimate_points` -> Estimate
7. `sprint` -> Cycle
8. `component` -> Label
9. `depends_on` -> Relation (add post-import if needed)
10. `acceptance_criteria` -> Description checklist

## 4) Import Notes
1. Keep `ticket_id` for traceability with planning docs.
2. Create epics in tool first, then bulk import stories/tasks.
3. Add dependency links in a second pass if importer cannot resolve by `ticket_id`.
