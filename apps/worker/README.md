# Worker App

Background worker for delayed reminder jobs.

## Responsibilities
1. Consume `reminders` queue jobs.
2. Persist delivered notifications.
3. Optionally call a webhook via `REMINDER_WEBHOOK_URL`.

## Run
```bash
npm run dev
```
