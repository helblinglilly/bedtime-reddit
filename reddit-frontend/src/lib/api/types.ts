import type { paths } from './schema';

export type VideosResponse =
	paths['/videos']['get']['responses'][200]['content']['application/json'];

export type Video = VideosResponse[number];
