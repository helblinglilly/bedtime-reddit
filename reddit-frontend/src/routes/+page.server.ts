import type { VideosResponse } from '#lib/api/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('https://api.reddit.helbling.uk/videos');
		if (!response.ok) {
			return {
				videos: [] as VideosResponse,
				errorMessage: 'Videos are temporarily unavailable. Please try again shortly.'
			};
		}

		const videos: VideosResponse = await response.json();
		return { videos, errorMessage: null };
	} catch {
		return {
			videos: [] as VideosResponse,
			errorMessage: 'Could not load videos. Please try again shortly.'
		};
	}
};
