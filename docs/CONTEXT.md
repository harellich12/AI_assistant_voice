# CONTEXT

This file is the persistent context snapshot for future chat refreshes.

## Project Summary
Android-first AI assistant project with:
1. Fastify API (`apps/api`)
2. BullMQ worker (`apps/worker`)
3. Android Compose scaffold (`apps/mobile-android`)
4. Multi-stage planning docs (`docs/stage-*`)

## Current Implemented Backend Scope
1. Auth middleware with dev bearer token.
2. Assistant flow:
   - `POST /v1/assistant/interpret`
   - `POST /v1/assistant/confirm`
3. Task flow:
   - `POST /v1/tasks` with idempotency key support
   - `GET /v1/tasks`
4. Audit/history:
   - `GET /v1/history/actions`
5. Reminders:
   - queue enqueue on `reminder_at`
   - worker consumption + DB notification persist
   - optional reminder webhook dispatch
6. Notifications:
   - `GET /v1/notifications`

## Data Model (Prisma)
1. `Task`
2. `ActionAudit`
3. `Notification`

Schema file:
- `apps/api/prisma/schema.prisma`

## Local Runtime Dependencies
1. Postgres
2. Redis
3. Node.js (WSL/Linux preferred when in WSL)

## Important Environment Variables
Configured in `apps/api/.env` and/or shell:
1. `DATABASE_URL`
2. `REDIS_URL`
3. `AUTH_DEV_TOKEN`
4. `JIRA_BASE_URL`
5. `JIRA_EMAIL`
6. `JIRA_API_TOKEN`
7. `JIRA_PROJECT_KEY`
8. `JIRA_BOARD_ID`
9. `REMINDER_WEBHOOK_URL` (optional)

## Jira Automation Status
Script:
- `scripts/jira-sync.mjs`

NPM commands:
1. `npm run jira:bootstrap-map`
2. `npm run jira:sync`
3. `npm run jira:debug`
4. `npm run jira:debug:access`

Mapping file:
- `docs/stage-3-build/jira-key-map.json`

Hooks installed:
1. `.githooks/post-commit`
2. `.githooks/pre-push`

## Git Status Notes
1. Repo initialized on `main`.
2. Remote set to GitHub `harellich12/AI_assistant_voice`.
3. Push from sandbox may fail due network restrictions; push from local machine terminal.

## How to Refresh Context in a New Chat
Paste this block first:

```text
Use docs/CONTEXT.md as the current project context.
Then inspect these files before coding:
- apps/api/src/index.ts
- apps/api/prisma/schema.prisma
- apps/worker/src/index.ts
- scripts/jira-sync.mjs
- docs/stage-3-build/jira-key-map.json
Goal for this session: <your goal>
```

## Suggested Next Engineering Steps
1. Add pagination/filtering to tasks/audit/notifications endpoints.
2. Add proper user model/auth beyond dev token.
3. Wire Android app to assistant endpoints and voice capture.
4. Add automated tests for API and worker flows.
