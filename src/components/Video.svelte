<script lang="ts">
import { getContext, onMount } from "svelte";
import type { Videos as Video } from "./Video.types";
import { contextKeys, deeplinks } from "../domain";

export let video: Video;

const hasTouchscreen = getContext<boolean>(contextKeys.hasTouchscreen);

let title = video.title;

function decodeHtmlEntities(text: string): string {
	const textArea = document.createElement("textarea");
	textArea.innerHTML = text;
	return textArea.value;
}

onMount(() => {
	title = decodeHtmlEntities(video.title);
});
</script>

<a href={deeplinks(hasTouchscreen).video(video.id)} 
    class="w-full bg-[#1e2327] rounded-md p-4 max-w-[450px] justify-center grid gap-2">
        <img src={video.thumbnail} alt={video.title} class="w-full h-auto rounded-md"/>
        <h3 class="text-xl">{title}</h3>
        <i>{video.uploaded.toLocaleTimeString('en-GB')}, {video.channel.name}</i>
</a>