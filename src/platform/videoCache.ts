import { API_BASE } from "$env/static/private";
import type { IYoutubeResponse } from "../routes/api/types";

export async function getCacheAge(resOriginal: Response) {
	if (resOriginal.status !== 200) {
		return 0;
	}

	if (!resOriginal.url.includes(API_BASE)) {
		return 3600;
	}

	const res = resOriginal.clone();

	const body = (await res.json()) as IYoutubeResponse;

	const lastUploadItem = body.items.sort((a, b) => {
		const aDate = new Date(a.snippet.publishedAt);
		const bDate = new Date(b.snippet.publishedAt);

		return aDate.valueOf() < bDate.valueOf() ? 1 : -1;
	})[0];

	const lastUpload = new Date(lastUploadItem.snippet.publishedAt);
	const now = new Date();
	const timeDifferenceInMilliseconds = now.getTime() - lastUpload.getTime();
	const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);
	tomorrow.setHours(18, 0, 0, 0);

	const msUntilNextDayWindowOpening = tomorrow.getTime() - now.getTime();

	const cacheForMs =
		timeDifferenceInHours < 18 ? msUntilNextDayWindowOpening : 5 * 60 * 1000; // 5 mins
	if (timeDifferenceInHours < 18) {
		return msUntilNextDayWindowOpening;
	}

	console.dir({
		now,
		lastUpload,
		timeDifferenceInHours,
		msUntilNextDayWindowOpening,
		cacheForMs,
	});

	return cacheForMs;
}
