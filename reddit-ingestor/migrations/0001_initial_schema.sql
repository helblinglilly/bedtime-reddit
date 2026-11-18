-- Migration number: 0001 	 2026-11-18T20:37:19.674Z
CREATE TABLE videos (
	id TEXT PRIMARY KEY,
	video_id TEXT NOT NULL,
	video_title TEXT NOT NULL,
	thumbnail_url TEXT NOT NULL,
	channel_id TEXT NOT NULL,
	channel_name TEXT NOT NULL,
	uploaded_at DATETIME,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX videos_uploaded_at
	ON videos (uploaded_at, video_id);

CREATE UNIQUE INDEX video_id_unique ON videos(video_id);
