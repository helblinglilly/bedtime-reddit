import type { getChannelVideos } from '../youtubeApi/api';

type Video = Awaited<ReturnType<typeof getChannelVideos>>[number];

export async function insertVideo(video: Video, db: Env['DB']) {
	await db
		.prepare(
			`INSERT INTO videos (
				video_id, video_title, thumbnail_url, channel_id, channel_name, uploaded_at
			)
			VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(video_id) DO NOTHING
			RETURNING id`,
		)
		.bind(video.videoId, video.videoTitle, video.thumbnail, video.channel.id, video.channel.name, video.uploadedAt)
		.first<{ id: number }>();
}
