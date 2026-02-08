# Product Requirements (v1)

## 1) Vision
Build a voice-first mobile AI assistant that captures tasks, syncs calendars, and helps coordinate day-to-day planning through trustworthy, confirmed actions.

## 2) Goals and Non-Goals
### Goals
1. Capture tasks quickly by voice or text.
2. Keep tasks and events synchronized with major calendar providers.
3. Provide coordination help: conflict detection, slot suggestions, and daily planning.
4. Maintain high trust via explicit confirmations and action history.

### Non-Goals (v1)
1. Autonomous execution of high-risk actions without confirmation.
2. Full email drafting/sending workflows.
3. Team project planning features beyond personal assistant scope.

## 3) Personas
1. Busy professional with work and personal calendars.
2. Student/individual managing classes, deadlines, and appointments.
3. Voice-first user who prefers fast capture over manual entry.

## 4) Core Use Cases
1. "Remind me to submit expense report Friday at 3 PM."
2. "Schedule 30 minutes with Sarah next week."
3. "What should I do in the next two hours?"
4. "Move my dentist appointment to Thursday morning."
5. "Give me my day plan."

## 5) Functional Requirements (MVP)
1. Input and interaction
   - Voice input (push-to-talk first; wake phrase optional post-MVP).
   - Text input fallback.
   - Conversational clarification when intent entities are incomplete.
2. Task management
   - Create/edit/complete/delete/snooze tasks.
   - Support due date/time, priority, tags, notes, reminders.
3. Calendar synchronization
   - OAuth connect/disconnect for Google, Apple (CalDAV), Microsoft Graph.
   - Read/write events with conflict awareness.
4. Coordination
   - Daily plan view and "next best action" suggestions.
   - Meeting slot suggestion using user constraints and availability windows.
5. Trust and control
   - Confirmation before create/update/delete actions affecting calendar/tasks.
   - Action summary after each successful write.
   - User-visible action history.
6. Notifications
   - Reminder notifications for tasks/events and schedule changes.
7. Memory and preferences
   - Store user preferences (working hours, focus blocks, preferred meeting lengths).
   - Short-term conversational context to reduce repetitive prompts.

## 6) Non-Functional Requirements
1. Performance
   - Median acknowledgement for simple intents < 1.5s.
   - P95 command completion for simple writes < 4s under normal load.
2. Reliability
   - Idempotent write operations.
   - Retry with exponential backoff for provider/API failures.
   - Queue-based async sync where provider limits apply.
3. Security
   - OAuth2 for provider access.
   - Encryption in transit (TLS) and at rest.
   - Secret/token storage isolated from application data.
4. Privacy
   - User-controlled retention period.
   - Data export and deletion workflow.
5. Operability
   - Structured logs, metrics, tracing, and alerting.
   - Audit trail for assistant-initiated actions.
6. Offline behavior
   - Offline capture queue for tasks/commands.
   - Automatic reconciliation when connectivity returns.

## 7) Assumptions and Constraints
1. Mobile-first (Android first; iOS later or parallel).
2. LLM/ASR/TTS providers are external dependencies with variable latency and quotas.
3. Calendar provider rate limits and API constraints must be respected.
4. User identity and auth are centralized per account.

## 8) Success Metrics
1. Task creation success rate > 95%.
2. Calendar action accuracy > 95%.
3. Median time-to-capture task < 10 seconds.
4. Week 4 retention > 35% for activated users.
5. Confirmation rejection rate monitored as quality signal.

## 9) Acceptance Criteria for MVP
1. User can connect at least one calendar provider and create/update/delete events.
2. User can create/manage tasks by voice and text.
3. System requests clarification when required fields are missing.
4. All modifying actions have explicit confirmation and post-action summary.
5. Daily planning response is generated from calendar + task state.
6. Action history shows who/what/when for assistant writes.
