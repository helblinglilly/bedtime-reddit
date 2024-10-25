interface IThumbnail {
	url: string;
	width: number;
	height: number;
}

export interface IYoutubeResponse {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: {
		kind: string;
		etag: string;
		id: {
			kind: string;
			videoId: string;
		};
		snippet: {
			publishedAt: string;
			channelId: string;
			title: string;
			description: string;
			thumbnails: {
				default: IThumbnail;
				medium: IThumbnail;
				high: IThumbnail;
			};
			channelTitle: string;
		};
		liveBroadcastContent: string;
		publishTime: string;
	}[];
}

export interface APIVideosResponse {
	link: string;
	title: string;
	thumbnail: string;
	channel: {
		name: string;
	};
	uploaded: string;
}
