# API Contracts (v1 Draft)

## 1) API Conventions
1. Base path: `/v1`
2. Auth: Bearer token (user session token).
3. Idempotency header for writes: `Idempotency-Key`.
4. Standard response envelope:
```json
{
  "data": {},
  "error": null,
  "meta": {}
}
```
5. Error model:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## 2) Assistant Interaction APIs

## `POST /assistant/interpret`
Purpose: Parse utterance and return intent + slots + required confirmations.

Request:
```json
{
  "input_mode": "voice",
  "utterance": "Add task pay rent tomorrow 9 AM",
  "context": {
    "timezone": "America/New_York",
    "conversation_id": "uuid"
  }
}
```

Response:
```json
{
  "data": {
    "intent": "task.create",
    "entities": {
      "title": "pay rent",
      "due_at": "2026-02-09T09:00:00-05:00"
    },
    "requires_confirmation": true,
    "missing_fields": []
  },
  "error": null,
  "meta": {}
}
```

## `POST /assistant/confirm`
Purpose: Confirm or cancel a proposed action.

Request:
```json
{
  "proposal_id": "uuid",
  "decision": "confirm"
}
```

Response:
```json
{
  "data": {
    "status": "success",
    "action_summary": "Created task 'pay rent' due tomorrow 9:00 AM."
  },
  "error": null,
  "meta": {}
}
```

## 3) Task APIs

## `POST /tasks`
Request:
```json
{
  "title": "Pay rent",
  "description": "",
  "priority": "high",
  "due_at": "2026-02-09T09:00:00-05:00",
  "reminder_at": "2026-02-09T08:45:00-05:00",
  "tags": ["finance"]
}
```

Response:
```json
{
  "data": {
    "id": "uuid",
    "status": "open"
  },
  "error": null,
  "meta": {}
}
```

## `GET /tasks`
Query params: `status`, `due_from`, `due_to`, `limit`, `cursor`.

## `PATCH /tasks/{task_id}`
Partial update fields: `title`, `status`, `priority`, `due_at`, `reminder_at`, `tags`.

## `DELETE /tasks/{task_id}`
Soft-delete or cancel semantics by product choice.

## 4) Calendar Connection APIs

## `POST /calendar/connections/{provider}/start`
Purpose: Begin OAuth flow.

## `POST /calendar/connections/{provider}/callback`
Purpose: Finalize provider connection with auth code exchange.

## `GET /calendar/connections`
Purpose: List connected providers + status.

## `DELETE /calendar/connections/{connection_id}`
Purpose: Revoke/disconnect provider.

## 5) Event APIs

## `POST /events`
Request:
```json
{
  "calendar_id": "uuid",
  "title": "Meeting with Sarah",
  "start_at": "2026-02-10T14:00:00-05:00",
  "end_at": "2026-02-10T14:30:00-05:00",
  "attendees": [
    {"name": "Sarah", "email": "sarah@example.com"}
  ],
  "location": "Zoom"
}
```

## `GET /events`
Query params: `from`, `to`, `calendar_id`, `cursor`.

## `PATCH /events/{event_id}`
Supports move/update with provider concurrency checks.

## `DELETE /events/{event_id}`
Cancel/delete mapped to provider-specific behavior.

## 6) Scheduling APIs

## `POST /schedule/suggest`
Purpose: Return ranked available slots.

Request:
```json
{
  "duration_minutes": 30,
  "participants": ["sarah@example.com"],
  "window_start": "2026-02-10T00:00:00-05:00",
  "window_end": "2026-02-17T00:00:00-05:00",
  "constraints": {
    "avoid_focus_blocks": true,
    "preferred_hours": ["09:00-17:00"]
  }
}
```

Response:
```json
{
  "data": {
    "suggestions": [
      {
        "start_at": "2026-02-10T14:00:00-05:00",
        "end_at": "2026-02-10T14:30:00-05:00",
        "score": 0.91,
        "reason": "No conflicts and within preferred hours."
      }
    ]
  },
  "error": null,
  "meta": {}
}
```

## 7) Preferences and Planning APIs

## `GET /preferences`
## `PUT /preferences`
Fields include work hours, focus blocks, default meeting duration, reminder defaults.

## `GET /planning/day?date=YYYY-MM-DD`
Purpose: Return daily plan combining events/tasks/priorities.

## 8) Audit and History APIs

## `GET /history/actions`
Query params: `from`, `to`, `action_type`, `cursor`.

Response contains status, timestamp, target, summary, and failure reason if applicable.

## 9) Webhooks/Internal Event Contracts
1. Provider sync events:
   - `calendar.sync.started`
   - `calendar.sync.completed`
   - `calendar.sync.failed`
2. Assistant action events:
   - `assistant.action.proposed`
   - `assistant.action.confirmed`
   - `assistant.action.executed`
   - `assistant.action.failed`

## 10) API Readiness Checklist
1. Idempotency behavior explicitly tested for all write endpoints.
2. Timezone behavior validated across DST transitions.
3. Error codes standardized and documented.
4. Permission checks and audit events enforced for every mutation.
