export function recordView(videoId: string) {
	if (typeof window === 'undefined') return;

	const now = new Date();
	const videos = getWatchedVideos();

	videos.push({ videoId: videoId, timestamp: now });

	const newVideos = videos.filter((video) => {
		const difference = Math.abs(now.valueOf() - video.timestamp.valueOf());
		const daysDifference = difference / (1000 * 3600 * 24);

		if (daysDifference > 31 * 3) {
			return false;
		}

		return true;
	});

	window.localStorage.setItem('watched', JSON.stringify(newVideos));
}

function getWatchedVideos() {
	if (typeof window === 'undefined') return [];

	let videosRaw = window.localStorage.getItem('watched');

	if (!videosRaw) {
		videosRaw = '[]';
	}

	const videos = JSON.parse(videosRaw) as Array<{ videoId: string; timestamp: Date }>;
	return videos;
}

export function isVideoWatched(videoId: string) {
	const watchedVideos = getWatchedVideos();

	return watchedVideos.some((watchedVideo) => watchedVideo.videoId === videoId);
}
