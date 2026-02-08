# Architecture Decision Rationale

Date: 2026-02-08  
Scope: Rationale for Stage 1-4 architecture and implementation setup choices.

## 1) Why `Mobile App -> Backend -> Providers`
Decision:
1. Keep provider calls (OpenAI/Gemini/calendar APIs) behind your backend.

Reasoning:
1. Security: API keys and OAuth refresh tokens stay server-side.
2. Control: confirmation policies, guardrails, and retries are centrally enforced.
3. Flexibility: model/provider routing can change without shipping a new app version.
4. Auditability: all state-changing actions are logged consistently.

Alternatives considered:
1. Direct app-to-provider calls:
   - faster to prototype, but weak for secret safety, policy enforcement, and traceability.

## 2) Why Confirmation-First Mutations
Decision:
1. Require user confirmation before create/update/delete actions.

Reasoning:
1. Trust: reduces risk from intent misinterpretation.
2. Safety: prevents destructive or incorrect writes.
3. Supportability: action intent and final decision are explicit in logs.

Tradeoff:
1. Slight friction in UX, accepted for MVP reliability and user confidence.

## 3) Why Vertical Slice First
Decision:
1. Build one full flow end-to-end before broadening feature scope.

Reasoning:
1. Validates architecture under real integration conditions.
2. Exposes missing contracts early (API, data, retries, observability).
3. De-risks Sprint 2/3 by proving core interaction path.

Selected slice:
1. `interpret -> confirm -> create task -> audit -> reminder enqueue`.

## 4) Why Queue-Based Background Work
Decision:
1. Use queue + workers for retries and delayed operations.

Reasoning:
1. External APIs are latency- and rate-limit-sensitive.
2. Retries/backoff need durable execution outside request lifecycle.
3. Reminder scheduling naturally fits asynchronous processing.

Tradeoff:
1. Added operational complexity (queue monitoring, DLQ handling), accepted for reliability.

## 5) Why Postgres + Redis Baseline
Decision:
1. Postgres as system of record; Redis for queue/cache.

Reasoning:
1. Postgres handles structured relational domain well (tasks/events/audit).
2. Redis integrates cleanly with job queues and short-lived state.
3. This pairing is common and low-risk for MVP scale.

Alternatives considered:
1. NoSQL-first approach:
   - less fit for relational query patterns and audit/reporting joins.

## 6) Why TypeScript Backend and Strong Contracts
Decision:
1. TypeScript + schema validation for API boundaries.

Reasoning:
1. Faster iteration with type safety across handlers/services.
2. Better contract consistency between docs and implementation.
3. Reduces integration bugs in multi-service flows.

## 7) Why Android-First Mobile Scope
Decision:
1. Focus MVP on Android before cross-platform expansion.

Reasoning:
1. Reduces delivery surface area.
2. Accelerates feedback on voice UX and coordination behavior.
3. Keeps planning and backlog aligned to a single client runtime initially.

## 8) Why Provider Rollout Sequencing
Decision:
1. Calendar provider 1 first (Google recommended), others later.
2. Primary model path + secondary fallback provider.

Reasoning:
1. Limits integration complexity during MVP.
2. Enables rapid stabilization and measurable quality loops.
3. Fallback path improves resilience without day-1 full parity overhead.

## 9) Why Stage-Based Documentation Structure
Decision:
1. Organize docs by planning/execution/build/kickoff stages.

Reasoning:
1. Maintains clarity as artifact count grows.
2. Makes handoff easier between product, engineering, and operations.
3. Preserves traceability from requirement to ticket.

## 10) Decision Quality Criteria Used
All decisions above were selected against these criteria:
1. User trust and safety first.
2. MVP speed without creating avoidable rework.
3. Operational reliability and recoverability.
4. Security and privacy by default.
5. Clear ownership and traceability into Jira execution.
