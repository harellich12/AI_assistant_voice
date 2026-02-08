# Tech Stack Decisions (Kickoff Baseline)

Date: 2026-02-08  
Status: Proposed baseline (lock before Sprint 1 starts)

## 1) Backend
1. Runtime: TypeScript on Node.js LTS.
2. API framework: Fastify (performance + schema validation).
3. Validation: Zod (request/response contracts).
4. ORM: Prisma (migrations + typed models).
5. Queue: Redis + BullMQ (retries, delayed jobs, dead-letter pattern).
6. Auth: JWT bearer tokens (app auth) + OAuth2 for providers.

## 2) Data and Storage
1. Primary DB: PostgreSQL.
2. Cache/session: Redis.
3. Audit/event logs: PostgreSQL table initially (can split later).
4. File/object storage: cloud object storage only if attachments are added.

## 3) Mobile
1. Android first (Kotlin + Jetpack Compose).
2. Voice capture via platform APIs (push-to-talk first).
3. Offline queue with local persistence (Room DB or equivalent).

## 4) AI and Integrations
1. LLM providers: OpenAI primary, Gemini secondary/fallback.
2. Speech path: provider APIs via backend policy routing.
3. Calendar: Google first for MVP, then Microsoft, then Apple/CalDAV.

## 5) Platform and DevOps
1. Containerized services (Docker).
2. CI: GitHub Actions (lint, test, build, migration checks).
3. Deployment target: managed container platform with staging/prod separation.
4. Observability: OpenTelemetry + logs + metrics dashboard.

## 6) Why this baseline
1. Fast backend iteration with strong typing.
2. Reliable queue model for provider retry behavior.
3. Clear Android-first focus reduces MVP complexity.
4. Provider-agnostic routing keeps cost/performance flexible.

## 7) Open Decisions To Confirm
1. Cloud vendor (GCP/AWS/Azure).
2. Managed Postgres/Redis provider.
3. Secrets manager choice.
