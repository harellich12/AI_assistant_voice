# Definition of Done (DoD) and Quality Gates

## 1) Definition of Done (Story Level)
A story is done only if all conditions are met:
1. Functional acceptance criteria pass.
2. Unit/integration tests added and passing.
3. Logs/metrics added for key operations and failures.
4. Security checks applied (auth, permission, input validation).
5. Audit record behavior validated for all mutations.
6. API docs updated when contracts change.
7. Code reviewed and approved.

## 2) Feature-Level Quality Gates

## Gate A: Build Quality
1. CI passes (lint, test, build).
2. No critical/static analysis blockers.
3. Dependency vulnerabilities triaged (critical/high blocked unless accepted exception).

## Gate B: Functional Reliability
1. Happy path and edge-case tests pass in staging.
2. Idempotency and retry behaviors validated.
3. Error handling returns deterministic API error codes.

## Gate C: Security and Privacy
1. Secrets are never embedded in client app.
2. Provider tokens stored in vault and access-controlled.
3. Sensitive data redaction confirmed in logs.
4. Data retention/deletion path validated.

## Gate D: Operational Readiness
1. SLI dashboard live:
   - latency, error rate, success rate, queue depth.
2. Alerts configured with escalation route.
3. Runbook includes top failure scenarios and mitigations.
4. Rollback strategy tested at least once in staging.

## 3) MVP Release Gate
MVP can ship only when:
1. All P0 backlog items are accepted.
2. Vertical slice and provider-1 calendar flows pass.
3. No open critical/P1 production blockers.
4. Support runbook and incident contacts are finalized.

## 4) Quality Ownership Matrix
1. Product: acceptance criteria and scope guardrails.
2. Engineering: implementation quality and tests.
3. Security: auth/token/logging controls.
4. Platform/SRE: reliability dashboards, alerts, runbooks.
