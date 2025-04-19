import { Logger, UserImpacts } from "$lib/log.js";
import type { APIVideosResponse } from "./api/types.js";

export const load = async (platform: App.Platform) => {
  console.log(platform, Object.keys(platform));
  const { fetch, ctx } = platform;
  const log = new Logger(ctx);

	const res = await fetch("/api/videos");

	let errorMessage: string | undefined;

	if (!res.ok) {
	  log.error("/api/videos responded with non-200 status code", {
			userImpact: UserImpacts.NO_VIDEOS,
		});
		try {
			const body = (await res.json()) as { errorMessage: string };
			if (typeof body?.errorMessage !== "undefined") {
				errorMessage = body.errorMessage;
			}
		} catch {
			errorMessage = "API response was not successful";
		}

		return {
			body: [],
			errorMessage,
		};
	}

	const body: APIVideosResponse[] = await res
		.json()
		.then((a) => a as APIVideosResponse[])
		.catch(() => {
			errorMessage = "Failed to JSON parse API response";
			log.error("/api/videos response was not JSON parsable", {
			userImpact: UserImpacts.NO_VIDEOS,
		});
			return [];
		});

	log.info('successful')
	return {
		errorMessage,
		body,
	};
};
