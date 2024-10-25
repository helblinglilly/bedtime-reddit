import type { APIVideosResponse } from "./api/types.js";

export const load = async ({ fetch }) => {
	const res = await fetch("/api/videos");

	let errorMessage: string | undefined;

	if (!res.ok) {
		errorMessage = "API response was not successful";
	}

	const body: APIVideosResponse[] = await res
		.json()
		.then((a) => a as APIVideosResponse[])
		.catch(() => {
			errorMessage = "Failed to JSON parse API response";
			return [];
		});

	return {
		errorMessage,
		body,
	};
};
