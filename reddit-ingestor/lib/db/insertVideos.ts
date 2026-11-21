import type { getChannelVideos } from '../youtubeApi/search/api';

type Video = Awaited<ReturnType<typeof getChannelVideos>>[number];

export async function insertVideos(videos: Video[], runtimes: ReadonlyMap<string, number | null>, db: Env['DB']) {
	return Promise.allSettled(videos.map((video) => insertVideo(video, runtimes.get(video.videoId) ?? null, db)));
}

async function insertVideo(video: Video, runtime: number | null, db: Env['DB']) {
	await db
		.prepare(
			`INSERT INTO videos (
				video_id, video_title, thumbnail_url, channel_id, channel_name, uploaded_at, runtime
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(video_id) DO NOTHING
			RETURNING id`,
		)
		.bind(video.videoId, video.videoTitle, video.thumbnail, video.channel.id, video.channel.name, video.uploadedAt, runtime)
		.first<{ id: number }>();

	await db.prepare("DELETE FROM videos WHERE datetime(uploaded_at) < datetime('now', '-3 month')").run();
}
