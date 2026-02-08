# AI Assistant Voice

Monorepo for an Android-first AI assistant with:
1. Backend API (`apps/api`)
2. Background worker (`apps/worker`)
3. Android app scaffold (`apps/mobile-android`)
4. Planning and architecture docs (`docs`)

## Quick Start
1. Install dependencies:
```bash
npm install
```
2. Start API:
```bash
npm run dev:api
```
3. Start worker:
```bash
npm run dev:worker
```

## Jira Automation
1. Bootstrap mapping:
```bash
npm run jira:bootstrap-map
```
2. Sync issues from commits:
```bash
npm run jira:sync
```

See `docs/stage-3-build/jira-automation.md` for details.
