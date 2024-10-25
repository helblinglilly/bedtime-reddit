import type { APIVideosResponse } from "../routes/api/types";

export interface Videos extends Omit<APIVideosResponse, "uploaded"> {
	uploaded: Date;
}
