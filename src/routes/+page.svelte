<script lang="ts">
import { getContext, onMount } from "svelte";
import Video from "../components/Video.svelte";
import type { Videos } from "../components/Video.types";
import { channels, contextKeys, deeplinks } from "../domain";
import type { PageData } from "./$types";

export let data: PageData;
let { body, errorMessage } = data;
let saveErrorMessage = errorMessage;

const hasTouchscreen = getContext<boolean>(contextKeys.hasTouchscreen);

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

function stripHtmlTags(html: string): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	return doc.body.textContent || "";
}

onMount(() => {
	saveErrorMessage = errorMessage ? stripHtmlTags(errorMessage) : undefined;
});
</script>

<h1 class="text-3xl font-extrabold">Reddit?</h1>

{#if saveErrorMessage}
	<main class="grid gap-4 pt-4">
		<p>Sorry something went wrong :(</p>
		<p>{saveErrorMessage}</p>

		<hr />

		<h2 class="text-xl">Here are some deeplinks to the channels</h2>

		{#each channels as channel}
			<a href={deeplinks(hasTouchscreen).channel(channel.id)} class="underline">{channel.name}</a>
		{/each}
	</main>
{:else}

	<main class="grid gap-4 content-center pt-4">
		{#each Object.keys(days) as day}
			<h2 class="text-xl">{new Date(day).toLocaleDateString('en-GB')}</h2>

			<div class="grid gap-2 justify-center py-4">
			{#each days[day] as video}
				<Video video={video} />
			{/each}
		</div>
		{/each}
	</main>
{/if}