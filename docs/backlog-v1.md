# Prioritized Backlog (v1)

## Prioritization Method
Priority order is `P0` (must-have MVP), `P1` (high-value for beta), `P2` (post-MVP improvements).

## Epic 1: Assistant Interaction Core
Priority: `P0`

User Stories:
1. As a user, I can speak a command and see the parsed intent before execution.
2. As a user, I receive clarification prompts when details are missing.
3. As a user, I must confirm any write action before it executes.

Acceptance Criteria:
1. Intent and entities shown in human-readable summary.
2. Missing required fields block execution until clarified.
3. Confirm/cancel path exists and is logged for each mutation.

## Epic 2: Task Management
Priority: `P0`

User Stories:
1. As a user, I can create tasks by voice or text.
2. As a user, I can update status (open/completed/snoozed).
3. As a user, I can set reminders and due dates.

Acceptance Criteria:
1. Create/update/delete task endpoints functional and audited.
2. Reminder scheduling succeeds and can be edited.
3. Offline task capture syncs after reconnect.

## Epic 3: Calendar Connectivity
Priority: `P0`

User Stories:
1. As a user, I can connect a calendar provider with OAuth.
2. As a user, I can create and modify events through the assistant.
3. As a user, I can disconnect provider access at any time.

Acceptance Criteria:
1. At least one provider fully supported in MVP.
2. Create/update/delete event flows include conflict checks.
3. Token revocation handled correctly on disconnect.

## Epic 4: Coordination and Planning
Priority: `P1`

User Stories:
1. As a user, I can ask for best time slots for meetings.
2. As a user, I can get a daily plan combining tasks/events.
3. As a user, I can request "what next" recommendations.

Acceptance Criteria:
1. Suggestions include rationale and ranking score.
2. Daily plan respects user preferences and availability.
3. Timezone and DST correctness validated.

## Epic 5: Trust, Audit, and Transparency
Priority: `P0`

User Stories:
1. As a user, I can view action history of assistant changes.
2. As a user, I can understand what changed and when.
3. As a user, I can see failed actions and retry safely.

Acceptance Criteria:
1. Action history endpoint and UI list available.
2. Every mutation includes summary and timestamp.
3. Idempotent retry supported for failed writes.

## Epic 6: Security and Privacy
Priority: `P0`

User Stories:
1. As a user, I can control connected accounts and consent scopes.
2. As a user, I can request data export and deletion.
3. As an admin, I can detect suspicious access patterns.

Acceptance Criteria:
1. Secrets stored outside primary DB.
2. Data retention and deletion policy implemented.
3. Security logging and alerts active in non-dev environments.

## Epic 7: Reliability and Operations
Priority: `P1`

User Stories:
1. As an operator, I can monitor core flows via dashboards.
2. As an operator, I can inspect provider sync failures.
3. As an operator, I can retry background jobs safely.

Acceptance Criteria:
1. SLIs for latency, success rate, and sync health defined.
2. Alert thresholds configured for core failures.
3. Queue retry behavior and dead-letter handling documented.

## MVP Slice Recommendation
1. Include Epics 1, 2, 3, 5, 6 baseline controls.
2. Include minimal slice of Epic 7 for production safety.
3. Defer most of Epic 4 to beta except basic daily summary.

## Backlog Hygiene Rules
1. Every story must include measurable acceptance criteria.
2. Every API mutation story must include audit requirements.
3. Security/privacy checks are required in definition of done.
