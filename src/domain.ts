export const channels = [
	{
		name: "UE Stories",
		id: "UCegtkvhLG9XYzWfRR99ateQ",
	},
	{
		name: "Updoot Studios",
		id: "UCEqKKebvZbAQoD3NRIn4jaQ",
	},
	{
		name: "On Tap Studios",
		id: "UC2sabBFKKPFcz8tg0lZwzvg",
	},
];

export const deeplinks = (hasTouchscreen: boolean) => {
	return {
		video: (videoId: string) =>
			hasTouchscreen
				? `vnd.youtube://${videoId}`
				: `https://youtube.com/watch?v=${videoId}`,
		channel: (channelId: string) =>
			hasTouchscreen
				? `vnd.youtube://channel/${channelId}`
				: `https://youtube.com/channel/${channelId}`,
	};
};

export const contextKeys = {
	hasTouchscreen: "hasTouchscreen",
};
