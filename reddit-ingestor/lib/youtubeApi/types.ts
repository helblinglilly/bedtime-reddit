export type YoutubeAPIResponse = SuccessResponse | ErrorResponse;

type Thumbnail = {
	url: string;
	width: number;
	height: number;
};

type SuccessResponse = {
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
			liveBroadcastContent: string;
			publishTime: string;
			channelId: string;
			title: string;
			description: string;
			thumbnails: {
				default: Thumbnail;
				medium: Thumbnail;
				high: Thumbnail;
			};
			channelTitle: string;
		};
	}[];
};

type ErrorResponse = {
	error: {
		message: string;
	};
};
