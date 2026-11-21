export type YoutubeAPIResponse =
	| {
			items: {
				id: string;
				contentDetails: { duration: string };
			}[];
	  }
	| { error: { message: string } };
