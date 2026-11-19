<script lang="ts">
	import { decodeHTML } from 'entities';
	import type { Video } from '#lib/api/types.js';
	import { deeplinks } from '#lib/deeplinks.js';
	import { getTouchscreen } from '#lib/touchscreen.js';

	let { video }: { video: Video } = $props();
	const hasTouchscreen = getTouchscreen();
	const title = $derived(decodeHTML(video.videoTitle));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- YouTube URLs use HTTPS or a native app scheme, not SvelteKit routes. -->
<a
	href={deeplinks($hasTouchscreen).video(video.videoId)}
	class="grid h-full w-full content-start gap-3 rounded-lg bg-[#1e2327] p-4 transition-colors hover:bg-[#282f35]"
>
	<img
		src={video.thumbnailUrl}
		alt=""
		loading="lazy"
		decoding="async"
		width="480"
		height="360"
		class="aspect-video w-full rounded-md object-cover"
	/>
	<h3 class="text-xl">{title}</h3>
	<p class="text-sm text-slate-300">
		<time datetime={video.uploadedAt}>
			{new Date(video.uploadedAt).toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				timeZone: 'UTC'
			})}
		</time>
		-
		<span aria-hidden="true"> </span>{video.channelName}
	</p>
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
