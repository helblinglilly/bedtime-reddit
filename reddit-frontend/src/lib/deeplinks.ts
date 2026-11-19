export const deeplinks = (hasTouchscreen: boolean) => ({
	video: (videoId: string) =>
		hasTouchscreen
			? `vnd.youtube://${encodeURIComponent(videoId)}`
			: `https://youtube.com/watch?v=${encodeURIComponent(videoId)}`,
	channel: (channelId: string) =>
		hasTouchscreen
			? `vnd.youtube://channel/${encodeURIComponent(channelId)}`
			: `https://youtube.com/channel/${encodeURIComponent(channelId)}`
});
