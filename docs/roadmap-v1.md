# Roadmap (MVP -> Beta -> GA)

## 1) Timeline Assumptions
1. Team can run discovery and build in parallel.
2. External calendar/AI integrations are available early.
3. Scope control is strict for MVP.

## 2) Phase Plan

## Phase 0: Foundation and Discovery (Weeks 1-3)
1. Finalize requirements and architecture baseline.
2. Validate primary user journeys and assistant confirmation UX.
3. Define security/privacy baselines and data retention defaults.

Exit Criteria:
1. PRD signed off.
2. C4 and data model approved.
3. MVP backlog prioritized with estimates.

## Phase 1: MVP Build (Weeks 4-10)
1. Mobile app shell (voice/text capture, auth, task/event views).
2. Assistant orchestration pipeline (intent, entities, clarification, confirmation).
3. Task service + storage + reminders.
4. Calendar integrations (Google first, then Microsoft, then Apple/CalDAV).
5. Action history and audit logging.

Exit Criteria:
1. End-to-end voice task creation works reliably.
2. At least one calendar provider full read/write working.
3. Confirmation gate enforced for all write operations.
4. Internal alpha passes acceptance criteria in `requirements-v1.md`.

## Phase 2: Private Beta (Weeks 11-14)
1. Scheduling suggestions and ranking improvements.
2. Daily planning and "next best action" quality tuning.
3. Reliability hardening: retries, queue health, sync reconciliation.
4. Observability dashboards and alert thresholds.

Exit Criteria:
1. 20-50 beta users onboarded.
2. Task/action accuracy and reliability meet target thresholds.
3. Critical security and privacy checks pass.

## Phase 3: General Availability (Weeks 15-18)
1. UX polish and onboarding improvements.
2. Expanded provider parity and edge-case handling.
3. SLO tracking and incident runbook validation.
4. Public launch readiness and support workflows.

Exit Criteria:
1. Core SLOs stable for 2 consecutive weeks.
2. No P0/P1 open defects.
3. Data export/delete and policy docs production-ready.

## 3) Milestone Map
1. M1 (Week 3): Architecture and PRD lock.
2. M2 (Week 7): Core assistant + tasks alpha.
3. M3 (Week 10): MVP feature complete.
4. M4 (Week 14): Beta complete with quality targets.
5. M5 (Week 18): GA launch.

## 4) Key Risks and Mitigations
1. Provider API inconsistency:
   - Mitigation: adapter layer + integration test suite + queue retries.
2. Latency spikes in LLM/speech providers:
   - Mitigation: timeouts, fallback models, async follow-up responses.
3. Incorrect assistant actions:
   - Mitigation: strict confirmation gate + safer defaults + audit visibility.
4. Scope creep:
   - Mitigation: enforce non-goals and phase gate approvals.
5. Calendar sync drift:
   - Mitigation: sync cursors, reconciliation jobs, idempotent writes.

## 5) Staffing and Ownership (Draft)
1. Product owner: requirements, prioritization, rollout decisions.
2. Mobile lead: app UX, local cache, notification UX.
3. Backend lead: orchestration, task/calendar services, APIs.
4. Platform/SRE: observability, deployment, reliability.
5. Security lead: threat model, policy, compliance readiness.
