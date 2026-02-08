# Environment and Secrets Setup

## 1) Environments
1. `dev`: local/integration development.
2. `staging`: release candidate validation.
3. `prod`: live user traffic.

## 2) Environment Configuration
Use environment-specific config files and secret injection at runtime.

Minimum config keys:
1. `APP_ENV`
2. `API_BASE_URL`
3. `DATABASE_URL`
4. `REDIS_URL`
5. `OPENAI_API_KEY`
6. `GEMINI_API_KEY`
7. `GOOGLE_OAUTH_CLIENT_ID`
8. `GOOGLE_OAUTH_CLIENT_SECRET`
9. `JWT_SIGNING_KEY`
10. `TOKEN_VAULT_URI`

## 3) Secret Management Rules
1. Never commit secrets to git.
2. Use secrets manager for all provider/API credentials.
3. Rotate keys periodically and on incident.
4. Restrict secret access by service role.

## 4) Runtime Security Baseline
1. TLS-only traffic.
2. Service-to-service auth where possible.
3. Per-service least-privilege IAM.
4. Structured log redaction for PII/tokens.

## 5) Release Promotion Flow
1. Merge to `main` triggers deploy to `dev`.
2. Tagged release candidate deploys to `staging`.
3. Manual approval gate required for `prod`.

## 6) Immediate Setup Checklist
1. Create all environment projects/accounts.
2. Provision Postgres and Redis per environment.
3. Register OAuth apps for calendar providers.
4. Insert baseline secrets in vault.
5. Validate health check + secret retrieval in `dev`.
