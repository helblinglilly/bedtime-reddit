# Reddit ingestor

Scheduled Cloudflare Worker that finds recent YouTube uploads and inserts them into the shared D1 database.

## Local development

From this directory, using Node.js 24:

```sh
npm ci
npm run dev
```

The scheduled Worker has a D1 binding at `env.DB`. The checked-in Wrangler configuration uses a dummy database UUID for local development and dry-run builds; local Wrangler uses a separate local database. Never deploy that configuration directly to production.

After changing bindings, run `npm run cf-typegen`. Run `npm run check` for configuration-generator tests, generated-type checks, TypeScript, and a Worker dry-run build.

## YouTube access and runtime enrichment

Only the ingestor has the `YOUTUBE_API_KEY` Secrets Store binding, typed as `SecretsStoreSecret`. Retrieve the value at runtime with `await env.YOUTUBE_API_KEY.get()`, not treat the binding as a string. Never log the returned value or request URLs containing it.

The ingestor searches for recent videos per channel, then looks up runtimes for all collected videos using `videos.list` in batches of up to 50 unique IDs. The database's nullable `runtime` column stores duration in seconds. Missing or zero-length durations and lookup failures result in `NULL` without blocking insertion. Existing rows are not backfilled or updated on conflict. Apply migration `0003_add_runtime.sql` before running the updated ingestor; deployment applies migrations automatically.

The checked-in Secrets Store binding uses a dummy store UUID and the secret name `BEDTIME_REDDIT_YOUTUBE_API_KEY`. For local development, create a local-only test secret (omit `--remote`; local Workers cannot read production Secrets Store values):

```sh
npx wrangler secrets-store secret create 00000000-0000-0000-0000-000000000000 --name BEDTIME_REDDIT_YOUTUBE_API_KEY --scopes workers
```

## Deployment and infrastructure

`npm run deploy` requires `D1_DATABASE_ID` and `YOUTUBE_SECRETS_STORE_ID`. `D1_DATABASE_NAME` optionally overrides `bedtime-reddit`. `scripts/configure-ci.mjs` generates the ignored `wrangler.ci.json`, and deployment uses that configuration. The generator validates the database UUID and store ID (32 hexadecimal characters or UUID format), rejecting dummy all-zero IDs. GitHub removes the generated file even if deployment fails. Production identifiers are not committed.

Infrastructure reuses the existing account-wide Secrets Store and manages only its Workers-scoped secret named `BEDTIME_REDDIT_YOUTUBE_API_KEY`, and publishes `YOUTUBE_SECRETS_STORE_ID` to the GitHub `production` environment. The deployment token must also be authorized to bind Secrets Store secrets (Secrets Store Deployer); CI never receives the YouTube API key value. See [Cloudflare's Workers integration](https://developers.cloudflare.com/secrets-store/integrations/workers/).

Terraform owns database provisioning; GitHub Actions owns Worker deployment. The ingestor deployment applies shared D1 migrations before deploying. The API does not apply migrations.

## Shared GitHub CI/CD

[`../.github/workflows/deploy-workers.yml`](../.github/workflows/deploy-workers.yml) owns checks and deployment for all three applications:

- Pull requests affecting any Worker, the frontend, or the workflow run all three applications' checks without production secrets. Frontend checks also build the production bundle.
- Matching pushes to `main` run checks, then deploy all three applications using the GitHub `production` environment. The API waits for the ingestor deployment, which applies shared D1 migrations first. The frontend deploys independently after its own checks pass.
- Manual workflow dispatch can deploy from `main` after checks pass.
- Production deployments are serialized per worker.

The `production` environment must provide these secrets (provisioned by the infrastructure repository):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` with permission to deploy Workers, access D1, and bind Secrets Store secrets
- `YOUTUBE_SECRETS_STORE_ID` (the store ID, not the YouTube API key or secret ID)
- `D1_DATABASE_ID`
- `D1_DATABASE_NAME` (optional; defaults to `bedtime-reddit`)

Configure a branch protection rule requiring `check-ingestor`, `check-api`, and `check-frontend` if checks should block merges, and configure any desired approvals on the GitHub `production` environment. For a repository-wide required check, remove workflow path filters or introduce an always-running gate so unrelated pull requests do not wait on a skipped workflow.

All three applications have separate check/deploy jobs, working directories, and concurrency groups. All are checked and deployed on matching workflow runs. Future workers should follow this pattern. See the [API README](../reddit-api/README.md) and [frontend README](../reddit-frontend/README.md) for their setup and deployment details.
