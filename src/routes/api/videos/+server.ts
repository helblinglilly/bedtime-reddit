import { fetchCacheFirst } from "../../../platform/platformCache.js";
import { API_BASE, YOUTUBE_API_KEY } from "$env/static/private";
import type { APIVideosResponse, IYoutubeResponse } from "../types.js";
import { channels } from "../../../domain.js";

export const GET = async ({ platform }) => {
	const queryParamsValues = channels.map((channel) => {
		return {
			maxResults: "5",
			order: "date",
			safeSearch: "none",
			channelId: channel.id,
			key: YOUTUBE_API_KEY,
			type: "video",
			part: "snippet",
		};
	});

	const promises = queryParamsValues.map((queryParamValue) => {
		const queryParams = new URLSearchParams(queryParamValue);
		return fetchCacheFirst(
			`${API_BASE}/search?${queryParams.toString()}`,
			platform,
		);
	});

	const settledResolutions = await Promise.allSettled(promises);
	const rejectedResolutions = settledResolutions
		.filter((res) => res.status === "rejected")
		.map((a) => a.reason);

	if (rejectedResolutions.length > 0) {
		console.log(rejectedResolutions.length, "requests failed");
		return new Response(
			JSON.stringify({
				error: "At least one request has failed",
			}),
			{
				headers: {
					"Content-Type": "application/json",
				},
				status: 500,
			},
		);
	}
	const resolutions = settledResolutions
		.filter((res) => res.status === "fulfilled")
		.map((a) => a.value);

	const happyResponses = resolutions.filter((a) => a.status === 200);
	const unhappyResponses = resolutions.filter((a) => a.status > 200);

	let errorCode = 500;
	let errorMessage: string | null = null;

	if (unhappyResponses.length > 0) {
		for (const response of unhappyResponses) {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const body = (await response.json()) as unknown as any;
				if (body.error.message && !errorMessage) {
					errorMessage = `${response.status} - ${body.error.message}`;

					console.log(response.status, JSON.stringify(body.error.message));
				}

				if (errorCode === 500) {
					errorCode = response.status;
				}
			} catch {
				console.log(response.status, "No error information provided");
			}
		}
	}

	const parsedItems: IYoutubeResponse[] = (await Promise.all(
		happyResponses.map((res) => res.json()),
	)) as unknown as IYoutubeResponse[];

	const flatItems = parsedItems.flatMap((a) => a.items);

	const bodies: APIVideosResponse[] = flatItems
		.map((a) => {
			return {
				id: a.id.videoId,
				title: a.snippet.title,
				thumbnail: a.snippet.thumbnails.medium.url,
				channel: {
					name: a.snippet.channelTitle,
				},
				uploaded: a.snippet.publishedAt,
			};
		})
		.sort((a, b) => {
			const aDate = new Date(a.uploaded);
			const bDate = new Date(b.uploaded);

			return aDate.valueOf() < bDate.valueOf() ? 1 : -1;
		});

	const uniqueBodies: APIVideosResponse[] = [];
	const linksSet = new Set<string>();

	for (const body of bodies) {
		if (!linksSet.has(body.id)) {
			linksSet.add(body.id);
			uniqueBodies.push(body);
		}
	}

	if (uniqueBodies.length > 0) {
		return new Response(JSON.stringify(uniqueBodies), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	if (errorMessage) {
		return new Response(JSON.stringify({ errorMessage }), {
			headers: {
				"Content-Type": "application/json",
			},
			status: errorCode,
		});
	}

	return new Response(
		JSON.stringify({ errorMessage: "Internal server error" }),
		{
			headers: {
				"Content-Type": "application/json",
			},
			status: errorCode,
		},
	);
};
