# MVP Scope Lock

Date: 2026-02-08  
Owner: Product + Engineering

## 1) MVP Objective
Deliver a trustworthy voice-first assistant that can create/manage tasks and perform confirmed calendar actions for individual users.

## 2) In-Scope (Locked)
1. Voice/text input with clarification flow.
2. Task CRUD + reminders + task status changes.
3. One calendar provider fully integrated first (Google recommended), with expandability to others.
4. Confirmation gate for all write actions.
5. Action history/audit visibility.
6. Basic daily planning summary based on tasks + calendar.
7. Essential observability (logging, metrics, errors).

## 3) Out-of-Scope (Locked Out)
1. Email composition/sending workflows.
2. Multi-user team collaboration features.
3. Fully autonomous high-risk actions without confirmation.
4. Advanced enterprise admin/governance features.
5. Complex multi-provider parity before first production MVP.

## 4) MVP Entry Criteria
1. All P0 backlog stories have clear acceptance criteria.
2. API contracts aligned with vertical slice and task/calendar flows.
3. Security baseline controls enabled (token vault, auth, audit).

## 5) MVP Exit Criteria
1. Vertical slice works end-to-end in staging.
2. P0 acceptance tests pass.
3. No open critical defects.
4. Basic operational readiness complete (alerts, runbook, rollback plan).

## 6) Scope Change Control
1. Any new item enters backlog as `P1+` by default.
2. Scope change requires:
   - impact estimate (timeline/cost/risk),
   - owner approval,
   - explicit trade-off (what is deferred).
3. No changes to locked-out scope during Sprint 1-3 unless blocking.
