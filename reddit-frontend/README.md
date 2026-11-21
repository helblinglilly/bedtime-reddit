# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@1.3.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" --install npm reddit-frontend
```

## Adding features

Add features to your project with `sv add`:

```sh
npx sv add
```

For example, to add Tailwind CSS:

```sh
npx sv add tailwindcss
```

## Developing

From `reddit-frontend/`, using Node.js 24, install dependencies with `npm ci`, then start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## API types

The API's Zod/OpenAPI definitions are the source of truth. Install dependencies in both `reddit-api` and `reddit-frontend` using Node.js 24, then run from this directory:

```sh
npm run api:types
```

This exports `../reddit-api/openapi.json` directly from the API router (no running server, D1, or credentials required) and generates `src/lib/api/schema.d.ts`. Commit both generated files after changing an API contract. Do not edit them manually.

Import `Video` and `VideosResponse` from `#lib/api/types.js`, or import `paths` from `#lib/api/schema.js` for other endpoint types. JSON timestamps such as `uploadedAt` are strings; convert them with `new Date(...)` when needed. Generated types do not perform runtime response validation.

`npm run check` includes `npm run api:types:check`, which fails if either the exported schema or generated types are stale. The generator lives in `reddit-api` because its TypeScript 5 dependency satisfies `openapi-typescript`'s peer requirement; the frontend remains on TypeScript 6. CI installs both applications' dependencies for frontend checks.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

Run `npm run check` for generated API-type consistency and Svelte/TypeScript checks, and `npm run build` for the production Cloudflare build.

## Deployment

`npm run deploy` builds and deploys the frontend Worker using the project's Cloudflare adapter.

GitHub Actions deploys the frontend on matching pushes to `main` and manual dispatches from `main`, after its checks and production build pass. It deploys independently of the ingestor and API, with its own working directory and production concurrency group.

The frontend reuses `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` from the GitHub `production` environment and needs no D1 or Secrets Store configuration. See [shared GitHub CI/CD](../reddit-ingestor/README.md#shared-github-cicd) for workflow triggers, required secrets, and branch protection guidance.
