# Tech Stack Rationale

Date: 2026-02-08  
Scope: Why the selected stack in `tech-stack-decisions.md` was chosen for MVP.

## 1) Backend: TypeScript + Node.js + Fastify
Decision:
1. Use TypeScript on Node.js LTS with Fastify.

Why:
1. Fast iteration speed for early-stage product changes.
2. Strong typing reduces integration and contract errors.
3. Fastify provides high performance and schema-oriented APIs.

Alternatives considered:
1. Python/FastAPI:
   - good productivity, but less alignment with typed shared contracts planned across services.
2. Go:
   - strong performance, but slower initial iteration for this MVP team profile.

Tradeoff:
1. Runtime performance is not maximal vs Go, but acceptable for MVP load.

## 2) API Validation: Zod
Decision:
1. Use Zod schemas at API boundaries.

Why:
1. Keeps runtime validation and TypeScript types close together.
2. Reduces drift between documented contracts and implementation.

Tradeoff:
1. Some schema verbosity, accepted for contract safety.

## 3) Data Layer: PostgreSQL + Prisma
Decision:
1. PostgreSQL as system of record, Prisma for ORM/migrations.

Why:
1. Domain is relational (users, tasks, calendars, events, audits).
2. Strong transactional integrity for confirmed write flows.
3. Prisma accelerates schema evolution in early product stages.

Alternatives considered:
1. NoSQL-first:
   - less fit for relational queries and audit-heavy workflows.

Tradeoff:
1. Prisma abstraction can hide SQL optimizations; acceptable for MVP scale.

## 4) Async Work: Redis + BullMQ
Decision:
1. Use Redis-backed queue workers for reminders/retries/sync jobs.

Why:
1. External providers are latency and rate-limit sensitive.
2. Durable retries and delayed jobs are required by design.
3. Clear pattern for dead-letter handling and worker isolation.

Tradeoff:
1. Adds operational components (Redis + worker management).

## 5) Mobile: Android-First (Kotlin + Jetpack Compose)
Decision:
1. Prioritize Android native MVP implementation.

Why:
1. Reduces complexity vs launching two platforms at once.
2. Faster feedback loop for voice UX and daily coordination flows.
3. Native APIs provide solid voice/input and local persistence support.

Alternatives considered:
1. Cross-platform first:
   - broader reach, but slower initial stabilization and more integration edge cases.

Tradeoff:
1. iOS reach deferred to later phase.

## 6) AI Provider Strategy: OpenAI Primary, Gemini Fallback
Decision:
1. Start with one primary model path and a secondary fallback path.

Why:
1. Improves resilience if one provider is degraded.
2. Supports cost/quality routing strategies.
3. Avoids hard lock-in to a single provider.

Tradeoff:
1. Additional routing complexity and testing surface.

## 7) Calendar Provider Rollout: Google First
Decision:
1. Integrate one provider fully before expanding to others.

Why:
1. Reduces integration and support complexity in MVP.
2. Enables faster hardening of end-to-end mutation/sync patterns.

Tradeoff:
1. Short-term provider coverage is limited.

## 8) Platform and Observability
Decision:
1. Dockerized services + CI checks + OpenTelemetry-style baseline.

Why:
1. Consistent local/staging/prod behavior.
2. Faster debugging with traces, metrics, and structured logs.
3. Supports quality gates defined in Stage 2.

Tradeoff:
1. More up-front setup work, accepted to reduce production risk.

## 9) Secrets and Security Posture
Decision:
1. Centralized secret management; no secrets in client binaries.

Why:
1. API keys and OAuth refresh tokens are high-risk assets.
2. Aligns with confirmation/audit trust model and compliance posture.

Tradeoff:
1. Requires secret rotation and access governance process.

## 10) Why This Stack Is Fit for MVP
1. Optimizes for delivery speed without sacrificing safety.
2. Matches the product’s core risk profile (mutating personal schedules/tasks).
3. Supports gradual scaling and provider expansion with minimal re-architecture.
