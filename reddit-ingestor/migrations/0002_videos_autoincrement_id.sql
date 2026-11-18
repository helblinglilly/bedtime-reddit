-- Existing text IDs are replaced with generated integer IDs; video_id remains stable.
CREATE TABLE videos_new (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	video_id TEXT NOT NULL,
	video_title TEXT NOT NULL,
	thumbnail_url TEXT NOT NULL,
	channel_id TEXT NOT NULL,
	channel_name TEXT NOT NULL,
	uploaded_at DATETIME,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO videos_new (
	video_id, video_title, thumbnail_url, channel_id, channel_name, uploaded_at, created_at
)
SELECT video_id, video_title, thumbnail_url, channel_id, channel_name, uploaded_at, created_at
FROM videos
ORDER BY rowid;

DROP TABLE videos;
ALTER TABLE videos_new RENAME TO videos;

CREATE INDEX videos_uploaded_at ON videos (uploaded_at, video_id);
CREATE UNIQUE INDEX video_id_unique ON videos (video_id);
