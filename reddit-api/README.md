# Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. From `reddit-api/`, using Node.js 24, install dependencies with `npm ci`.
3. Run `npm run dev` for local development and `npm run check` to validate the API.
4. Production deployment is managed by the repository's GitHub Actions workflow on `main`, using the shared `production` environment credentials and D1 configuration. See [shared GitHub CI/CD](../reddit-ingestor/README.md#shared-github-cicd) for workflow triggers, required secrets, concurrency, and branch protection guidance.

The API shares the ingestor's D1 database through `env.DB`, but has no YouTube Secrets Store binding. The checked-in Wrangler configuration uses a dummy D1 UUID. Do not deploy it directly. For an authenticated manual deployment, set `D1_DATABASE_ID` (and optionally `D1_DATABASE_NAME`) and run `npm run deploy`. This generates the ignored `wrangler.ci.json`; remove that file afterward. Shared database migrations are owned by the ingestor deployment.

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [chanfana documentation](https://chanfana.pages.dev/) and [Hono documentation](https://hono.dev/docs).

## OpenAPI export and frontend types

`npm run openapi:export` writes the router's OpenAPI document to `openapi.json` without starting a server or accessing D1. The running API also serves this document at `/openapi.json`.

After changing a response schema, run `npm run api:types` (also available from `reddit-frontend`) and commit `openapi.json` and `../reddit-frontend/src/lib/api/schema.d.ts`. `npm run openapi:check`, included in API checks, detects stale schema exports. `npm run api:types:check` checks both generated artifacts without modifying them.

`uploadedAt` is an ISO 8601 UTC datetime string in JSON, described by `z.iso.datetime()`. `runtime` is a non-negative integer in seconds, returning `0` when the database runtime is unavailable.

## Development

Run `npm run check` for OpenAPI consistency checks, existing OpenAPI and configuration-generator tests, generated-type checks, TypeScript, and a dry-run build. Run `npm run cf-typegen` after changing bindings.


1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.
