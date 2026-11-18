import { getChannelVideos } from '../youtubeApi/api';

export function upsertVideo(video: ReturnType<typeof getChannelVideos>, db: Env['DB']) {
	console.log('trying to insert video', video);
}
