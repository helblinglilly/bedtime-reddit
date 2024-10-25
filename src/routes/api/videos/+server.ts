import { fetchCacheFirst } from "../../../platform/platformCache.js";
import { API_BASE, YOUTUBE_API_KEY } from "$env/static/private";
import type { APIVideosResponse, IYoutubeResponse } from "../types.js";

const channelIds = [
	"UCegtkvhLG9XYzWfRR99ateQ", // UE Stories
	"UCEqKKebvZbAQoD3NRIn4jaQ", // Updoot Studios
	"UC2sabBFKKPFcz8tg0lZwzvg", // OnTapStudios
];

export const GET = async ({ platform }) => {
	const queryParamsValues = channelIds.map((channelId) => {
		return {
			maxResults: "5",
			order: "date",
			safeSearch: "none",
			channelId,
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

	if (unhappyResponses.length > 0) {
		console.log(unhappyResponses.map((a) => a.status).join(" - "));
	}

	const parsedItems: IYoutubeResponse[] = (await Promise.all(
		happyResponses.map((res) => res.json()),
	)) as unknown as IYoutubeResponse[];

	const flatItems = parsedItems.flatMap((a) => a.items);

	const bodies: APIVideosResponse[] = flatItems
		.map((a) => {
			return {
				link: `https://youtube.com/watch?v=${a.id.videoId}`,
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
		if (!linksSet.has(body.link)) {
			linksSet.add(body.link);
			uniqueBodies.push(body);
		}
	}

	return new Response(JSON.stringify(uniqueBodies), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
