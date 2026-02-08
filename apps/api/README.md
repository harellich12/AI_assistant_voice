# API App

Backend service for task/assistant endpoints.

## Current endpoints
1. `GET /health`
2. `POST /v1/assistant/interpret`
3. `POST /v1/assistant/confirm`
4. `POST /v1/tasks`
5. `GET /v1/tasks`
6. `GET /v1/history/actions`
7. `GET /v1/notifications`

## Run
```bash
npm run dev
```

## Data
Uses Prisma schema in `prisma/schema.prisma`.
