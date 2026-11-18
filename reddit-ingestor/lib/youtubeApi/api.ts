import { API_URL } from '../../src/channels';
import { youtubeResponseMock } from './mocks';
import { YoutubeAPIResponse } from './types';

export async function getChannelVideos(channelId: string, env: Env) {
	let apiKey = '';
	try {
		apiKey = await env.YOUTUBE_API_KEY.get();
	} catch (error) {
		console.error('Failed to get YOUTUBE_API_KEY env variable - using Mocks', error);
	}

	if (!apiKey) {
		return [];
	}

	const params = new URLSearchParams({
		maxResults: '5',
		order: 'date',
		safeSearch: 'none',
		channelId: channelId,
		key: apiKey,
		type: 'video',
		part: 'snippet',
	});

	const url = new URL(`/search?${params.toString()}`, API_URL);

	const res = await fetch(url);

	const body = (await res.json()) as unknown as YoutubeAPIResponse;

	if ('error' in body) {
		const error = new Error(`${body.error.message} - HTTP ${res.status}`);
		error.name = 'YoutubeAPIError';

		throw error;
	}

	return body.items.map((item) => {
		return {
			videoId: item.id.videoId,
			videoTitle: item.snippet.title,
			thumbnail: item.snippet.thumbnails.medium.url,
			channel: {
				name: item.snippet.channelTitle,
				id: item.snippet.channelId,
			},
			uploadedAt: item.snippet.publishedAt,
		};
	});
}
