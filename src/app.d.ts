// See https://kit.svelte.dev/docs/types#app

import type { ILogger } from "$lib/log";

// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
			caches: CacheStorage & { default: Cache };
		}
		interface Locals {
      logger: ILogger;
		}
	}
}

export { };
