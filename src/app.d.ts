// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
		  fetch: (url: string) => Promise<{ ok: boolean, json: () => Promise<unknown>}>
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
			caches: CacheStorage & { default: Cache };
		}
	}
}

export { };
