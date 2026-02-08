# Coding Readiness Gate

Use this checklist to decide if implementation can start immediately.

## 1) Must Be Ready (Go Criteria)
1. Sprint 1 tickets imported and assigned.
2. MVP scope lock accepted.
3. Vertical slice spec accepted.
4. Tech stack baseline accepted.
5. Repo structure approved.
6. Dev environment prerequisites available (DB/Redis/runtime).
7. Secrets approach agreed (at least for dev).

## 2) Can Be Deferred (Non-Blocking for Day 1)
1. Full production cloud vendor selection.
2. Final provider-2 integration strategy.
3. Complete SLO dashboard set (initial subset is enough).

## 3) Blockers (No-Go)
1. No ticket ownership for Sprint 1.
2. No authentication approach selected.
3. No task schema/idempotency contract agreed.
4. No access to model API keys for dev testing.

## 4) Current Status Template
Set each item to `Done`, `In Progress`, or `Blocked`.

1. Sprint 1 assignments: `In Progress`
2. MVP scope lock: `Done`
3. Vertical slice spec: `Done`
4. Tech stack baseline: `Done`
5. Repo structure approval: `Done`
6. Dev infrastructure readiness: `In Progress`
7. Dev secret availability: `In Progress`

## 5) Start-Coding Decision
If no `No-Go` blockers remain, coding should start immediately with:
1. auth middleware,
2. interpret endpoint,
3. task create with idempotency,
4. audit hook.
