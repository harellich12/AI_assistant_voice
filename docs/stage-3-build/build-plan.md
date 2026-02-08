# Build Plan (Stage 3)

## 1) Sprint Sequencing

## Sprint 1 (Foundation + Vertical Slice Core)
1. Backend project scaffolding and CI.
2. Auth middleware and request correlation IDs.
3. `POST /v1/assistant/interpret` + `POST /v1/assistant/confirm`.
4. `POST /v1/tasks` and DB migration.
5. Audit write hooks and reminder queue skeleton.
6. Mobile shell: voice/text input + confirm UI.

Exit target:
1. End-to-end: voice command -> confirmation -> task created -> audit logged.

## Sprint 2 (Task Lifecycle + Provider 1 Calendar)
1. Task read/update/delete APIs.
2. Calendar OAuth connect/disconnect for provider 1.
3. Event create/update/delete path with confirmation.
4. Retry/backoff workers and dead-letter handling baseline.
5. Reminder delivery path and status tracking.

Exit target:
1. Provider 1 calendar mutation stable in staging.

## Sprint 3 (Hardening + Planning + Release Readiness)
1. `GET /v1/planning/day`.
2. `GET /v1/history/actions`.
3. Security hardening (token vault, redaction checks, retention config).
4. SLO dashboards + alert thresholds + on-call runbook.
5. Go/no-go test and release checklist closure.

Exit target:
1. P0 features production-ready with no critical blockers.

## 2) Critical Path
1. Auth + API skeleton.
2. Assistant interpret/confirm flow.
3. Task persistence + idempotency + audit.
4. Calendar provider 1 integration.
5. Observability and release readiness.

## 3) Dependency Notes
1. Mobile confirm UX depends on interpret endpoint response shape.
2. Calendar event APIs depend on OAuth connection completion.
3. Daily planning depends on stable task/event query paths.
4. Production launch depends on security and operational gates.
