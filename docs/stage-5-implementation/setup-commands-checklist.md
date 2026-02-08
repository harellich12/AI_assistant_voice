# Setup Commands Checklist

Use this as a command-level startup checklist for local implementation.

## 1) Repository Initialization
```bash
mkdir -p apps/api apps/worker apps/mobile-android packages/shared-types packages/shared-config infra/ci
git init
```

## 2) Node/TypeScript Backend Bootstrapping
```bash
cd apps/api
npm init -y
npm install fastify zod
npm install -D typescript tsx @types/node eslint
npx tsc --init
```

## 3) Worker Service Bootstrapping
```bash
cd ../worker
npm init -y
npm install bullmq ioredis
npm install -D typescript tsx @types/node
npx tsc --init
```

## 4) Database and ORM Setup
```bash
cd ../api
npm install prisma @prisma/client
npx prisma init
```

## 5) Local Infrastructure (Example via Docker)
```bash
docker run --name ava-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=assistant -p 5432:5432 -d postgres:16
docker run --name ava-redis -p 6379:6379 -d redis:7
```

## 6) Environment Variables
Create `.env` for local dev with:
```bash
APP_ENV=dev
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/assistant
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=...
GEMINI_API_KEY=...
JWT_SIGNING_KEY=...
```

## 7) Basic Run Commands
```bash
# API
cd apps/api
npm run dev

# Worker
cd ../worker
npm run dev
```

## 8) Validation Commands
```bash
npm run lint
npm test
npm run build
```

## Notes
1. Commands are baseline templates; adapt to final cloud/CI decisions.
2. Do not commit `.env` files.
