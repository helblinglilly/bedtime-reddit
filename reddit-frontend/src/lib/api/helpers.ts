export function parseRuntime(runtime: number) {
	const minutes = Math.floor(runtime / 60);

	const seconds = runtime % 60;

	return {
		minutes: String(minutes).padStart(2, '0'),
		seconds: String(seconds).padStart(2, '0')
	};
}
