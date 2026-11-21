-- Runtime is measured in seconds; existing videos and unavailable runtimes remain NULL.
ALTER TABLE videos ADD COLUMN runtime INTEGER CHECK (runtime > 0);
