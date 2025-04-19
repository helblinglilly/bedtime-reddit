import { Logger, UserImpacts } from "$lib/log";
import { getCacheAge } from "./videoCache";

export const fetchCacheFirst = async (
	url: string | URL,
	platform: Readonly<App.Platform> | undefined,
): Promise<Response> => {
  const log = new Logger(platform?.ctx);

	const parsedUrl = new URL(url);
	const req = new Request(parsedUrl);

	if (platform?.caches?.default) {
		try {
			const cacheResponse = await platform.caches.default.match(url);
			if (cacheResponse) {
				return cacheResponse;
			}
		} catch (err) {
      log.warn("Tried to read from cache but got an error", {
        userImpact: UserImpacts.PERFORMANCE
      });
		}
	}

	const res = await fetch(req);

	const responseToCache = res.clone();
	const modifiedHeaders = new Headers(responseToCache.headers);

	const cacheAge = await getCacheAge(responseToCache);

	modifiedHeaders.set("Cache-Control", `max-age=${cacheAge}`);

	const modifiedResponse = new Response(responseToCache.body, {
		status: responseToCache.status,
		statusText: responseToCache.statusText,
		headers: modifiedHeaders,
	});

	if (res.ok && platform?.caches?.default) {
		try {
			if (platform?.ctx) {
				platform.ctx.waitUntil(
					platform.caches.default.put(url, modifiedResponse.clone()),
				);
			}
		} catch (err) {
			console.log("Failed to place successful response in cache", err);
		}
	}
	return modifiedResponse;
};
