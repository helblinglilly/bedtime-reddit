# Bedtime Reddit

## Reddit ingestor

From `reddit-ingestor/`, using Node.js 24:

```sh
npm ci
npm run dev
```

The scheduled Worker has a D1 binding at `env.DB`. The checked-in Wrangler configuration uses a dummy database UUID for local development and dry-run builds; local Wrangler uses a separate local database. Never deploy that configuration directly to production.

After changing bindings, run `npm run cf-typegen`. Run `npm run check` to check generated types, TypeScript, and the Worker build.

## GitHub CI/CD

`.github/workflows/deploy-workers.yml` owns application checks and deployment:

- Pull requests affecting the ingestor or workflow run checks without production secrets.
- Matching pushes to `rearchitecture` run checks, then deploy the ingestor using the GitHub `production` environment.
- Manual workflow dispatch can deploy from `rearchitecture` after checks pass.
- Production deployments are serialized per worker.

The `production` environment must provide these secrets (currently provisioned by the infrastructure repository):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` with permission to deploy Workers and access the D1 database
- `D1_DATABASE_ID`
- `D1_DATABASE_NAME` (optional; defaults to `bedtime-reddit`)

`npm run deploy` requires `D1_DATABASE_ID`, generates the ignored `reddit-ingestor/wrangler.ci.json`, and deploys with that configuration. The generator validates the UUID and rejects the local dummy ID. GitHub removes the generated file even if deployment fails. Production identifiers are not committed.

Terraform continues to own database provisioning; GitHub Actions owns Worker deployment. There are no schema migrations yet, so deployment does not apply migrations. Add an explicit migration step when the schema is introduced.

Configure a branch protection rule requiring `check-ingestor` if checks should block merges, and configure any desired approvals on the GitHub `production` environment. For a repository-wide required check, remove workflow path filters or introduce an always-running gate so unrelated pull requests do not wait on a skipped workflow.

Future workers and the frontend should have their own scoped check/deploy jobs, working directories, and concurrency groups. This workflow currently builds and deploys only `reddit-ingestor`.
