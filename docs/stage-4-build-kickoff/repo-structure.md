# Repo Structure (Kickoff)

## 1) Recommended Layout (Monorepo)
```text
/
  apps/
    mobile-android/
    api/
    worker/
  packages/
    shared-types/
    shared-config/
    observability/
    test-utils/
  infra/
    docker/
    ci/
    environments/
  docs/
```

## 2) Ownership
1. `apps/mobile-android`: Mobile team.
2. `apps/api`: Backend API team.
3. `apps/worker`: Backend async/sync jobs team.
4. `packages/*`: Shared platform ownership.
5. `infra/*`: Platform/SRE ownership.

## 3) Branching and PR Rules
1. `main` always releasable.
2. Feature branches: `feat/<ticket-id>-<short-name>`.
3. Require PR review + CI green before merge.
4. No direct pushes to `main`.

## 4) CI Jobs (Minimum)
1. Lint.
2. Unit tests.
3. Build.
4. Migration validation.
5. API contract check.

## 5) Initial Definition of Ready for a Ticket
1. Has acceptance criteria.
2. Has owner.
3. Has dependency status clear.
4. Has target sprint.
