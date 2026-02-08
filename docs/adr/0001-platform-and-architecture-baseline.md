# ADR 0001: Platform and Architecture Baseline

Status: Accepted  
Date: 2026-02-08

## Context
The product needs a reliable voice-first mobile assistant that can safely manage tasks and calendar actions across multiple providers. The system must support fast interaction, high trust, and future extensibility.

## Decision
1. Use a mobile client + backend orchestration architecture.
2. Keep assistant orchestration separate from provider-specific integration adapters.
3. Enforce confirmation before all state-changing assistant actions.
4. Use queue-driven asynchronous workers for provider sync and retries.
5. Store provider tokens in dedicated secrets vault, not app primary DB.
6. Implement audit logging as mandatory for every mutation.

## Rationale
1. Separation of concerns improves maintainability and provider portability.
2. Confirmation-first interaction lowers risk from model interpretation errors.
3. Async job handling increases resilience to provider rate limits and transient failures.
4. Vault isolation reduces token exposure risk.
5. Audit trails improve user trust and operational debugging.

## Consequences
### Positive
1. Better reliability and recoverability.
2. Lower security exposure for high-value credentials.
3. Clear traceability of assistant behavior.

### Negative
1. Added implementation complexity (queue infrastructure + job semantics).
2. Slightly higher user friction from confirmation steps.
3. More up-front architecture work before feature velocity peaks.

## Alternatives Considered
1. Client-heavy direct provider integration:
   - Rejected due to inconsistent security posture and poor centralized auditing.
2. Fully synchronous backend calls:
   - Rejected due to rate-limit sensitivity and weak retry semantics.
3. No explicit confirmation for low-risk writes:
   - Rejected for MVP; may be revisited after trust calibration and user controls.

## Follow-Up ADRs Needed
1. ADR for long-term memory policy (opt-in vs default-on).
2. ADR for provider rollout order and parity guarantees.
3. ADR for model/provider strategy (single vs multi-provider routing).
