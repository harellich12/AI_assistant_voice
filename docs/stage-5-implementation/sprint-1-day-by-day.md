# Sprint 1 Day-by-Day Plan

Sprint length: 10 working days  
Scope: Vertical slice (`interpret -> confirm -> create task -> audit -> reminder enqueue`)

## Day 1
1. Confirm Sprint 1 ticket assignments and dependency order.
2. Create repos/monorepo skeleton and branch protections.
3. Configure CI baseline (lint, test, build).

## Day 2
1. Set up dev environment (DB, Redis, env vars).
2. Implement auth middleware and request ID middleware.
3. Add structured logging baseline.

## Day 3
1. Implement `POST /v1/assistant/interpret` minimal parser path.
2. Add contract tests for interpret response schema.
3. Wire basic mobile request to interpret endpoint.

## Day 4
1. Implement `POST /v1/assistant/confirm`.
2. Implement cancel path and no-mutation assertions.
3. Add integration tests for confirm lifecycle.

## Day 5
1. Add DB migrations for `Task` and `ActionAudit`.
2. Implement `POST /v1/tasks` with idempotency.
3. Add unit tests for idempotency behavior.

## Day 6
1. Add audit hook for task creation success/failure.
2. Add reminder queue producer on task create.
3. Verify queue payload schema and retry metadata.

## Day 7
1. Build mobile confirmation UI and success/error summaries.
2. Hook mobile flow end-to-end with backend in dev.
3. Run first internal demo of vertical slice.

## Day 8
1. Harden error handling and API error contracts.
2. Add observability dashboards for key slice metrics.
3. Fix defects from internal demo.

## Day 9
1. Run end-to-end test suite and staging smoke test.
2. Close high-priority bug fixes.
3. Validate acceptance criteria against slice spec.

## Day 10
1. Sprint review and demo.
2. Document known issues and carry-over items.
3. Final go/no-go decision for moving to Sprint 2 scope.
