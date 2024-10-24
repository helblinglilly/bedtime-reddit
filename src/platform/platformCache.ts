export const fetchCacheFirst = async(url: string | URL, platform: Readonly<App.Platform> | undefined): Promise<Response> => {
	const parsedUrl = new URL(url);
	const req = new Request(parsedUrl);

	if (platform?.caches?.default){
		try {
			const cacheResponse = await platform.caches.default.match(url);
			if (cacheResponse){
				return cacheResponse;
			}
		} catch(err){
            console.log('Tried to read from cache but got an error', err)
		}
	}

	const res = await fetch(req);
	if (res.ok && platform?.caches?.default){
		try {
			const responseToCache = res.clone();
            platform.ctx.waitUntil(
                platform.caches.default.put(url, responseToCache)
            );
		} catch(err){
            console.log('Failed to place successful response in cache', err);
		}
	}
	return res;
}
