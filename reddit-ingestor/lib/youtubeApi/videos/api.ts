import { API_URL } from '../../../src/channels';
import type { YoutubeAPIResponse } from './types';

export function parseRuntime(duration: string): number | null {
	if (!duration.startsWith('P')) {
		return null;
	}

	let remaining = duration.slice(1);
	let runtime = 0;
	const units = [
		{ suffix: 'D', seconds: 86400 },
		{ suffix: 'H', seconds: 3600 },
		{ suffix: 'M', seconds: 60 },
		{ suffix: 'S', seconds: 1 },
	];

	for (const { suffix, seconds } of units) {
		if (suffix === 'H' && remaining.length > 0) {
			if (!remaining.startsWith('T') || remaining.length === 1) {
				return null;
			}
			remaining = remaining.slice(1);
		}

		const unitIndex = remaining.indexOf(suffix);
		if (unitIndex === -1) {
			continue;
		}

		const amount = remaining.slice(0, unitIndex);
		if (amount.length === 0 || [...amount].some((character) => character < '0' || character > '9')) {
			return null;
		}

		runtime += Number(amount) * seconds;
		remaining = remaining.slice(unitIndex + 1);
	}

	if (remaining.length > 0) {
		return null;
	}
	// Zero-length durations can be returned before a live video's runtime is known.
	return Number.isSafeInteger(runtime) && runtime > 0 ? runtime : null;
}

export async function getVideoRuntimes(videoIds: string[], env: Env): Promise<Map<string, number | null>> {
	const runtimes = new Map<string, number | null>();
	const uniqueIds = [...new Set(videoIds)];
	if (uniqueIds.length === 0) {
		return runtimes;
	}

	const apiKey = await env.YOUTUBE_API_KEY.get();
	if (!apiKey) {
		throw new Error('YOUTUBE_API_KEY is unavailable');
	}

	for (let offset = 0; offset < uniqueIds.length; offset += 50) {
		const params = new URLSearchParams({
			part: 'contentDetails',
			id: uniqueIds.slice(offset, offset + 50).join(','),
			key: apiKey,
		});
		const response = await fetch(new URL(`/youtube/v3/videos?${params}`, API_URL));
		const body = (await response.json()) as YoutubeAPIResponse;
		if (!response.ok || 'error' in body) {
			// Do not include request URLs or API response messages that might contain credentials.
			const error = new Error(`YouTube videos request failed - HTTP ${response.status}`);
			error.name = 'YoutubeAPIError';
			throw error;
		}

		for (const item of body.items) {
			runtimes.set(item.id, parseRuntime(item.contentDetails.duration));
		}
	}

	return runtimes;
}
