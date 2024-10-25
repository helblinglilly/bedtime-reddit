<script lang="ts">
import Video from "../components/Video.svelte";
import type { Videos } from "../components/Video.types";
import type { PageData } from "./$types";

export let data: PageData;
let { body, errorMessage } = data;

const days: Record<string, Videos[]> = body.reduce(
	(acc, video) => {
		const parsedVideo = {
			...video,
			uploaded: new Date(video.uploaded),
		};
		const date = parsedVideo.uploaded.toISOString().split("T")[0];
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(parsedVideo);
		return acc;
	},
	{} as Record<string, Videos[]>,
);
</script>

<h1>Reddit?</h1>
<h1>{errorMessage}</h1>

<div class="grid gap-4">
    {#each Object.keys(days) as day}
        <h2 class="text-2xl">{new Date(day).toLocaleDateString('en-GB')}</h2>

        <div class="grid gap-2">
        {#each days[day] as video}
            <Video video={video} />
        {/each}
    </div>
    {/each}
</div>