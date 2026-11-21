<script lang="ts">
	import { decodeHTML } from 'entities';
	import type { Video } from '#lib/api/types.js';
	import { deeplinks } from '#lib/deeplinks.js';
	import { getTouchscreen } from '#lib/touchscreen.js';
	import { isVideoWatched, recordView } from './watched/storage';
	import { parseRuntime } from './api/helpers';

	let { video }: { video: Video } = $props();
	const hasTouchscreen = getTouchscreen();
	const title = $derived(decodeHTML(video.videoTitle));

	let isWatched = $state(false);

		function refreshWatched() {
			isWatched = isVideoWatched(video.videoId);
		}

		$effect(() => {
			refreshWatched();
		});
	const runTime = $derived(parseRuntime(video.runtime))
</script>

<svelte:window onfocus={refreshWatched} onpageshow={refreshWatched} />

<!-- eslint-disable svelte/no-navigation-without-resolve -- YouTube URLs use HTTPS or a native app scheme, not SvelteKit routes. -->
<a
	href={deeplinks($hasTouchscreen).video(video.videoId)}
	class="grid h-full w-full content-start gap-3 rounded-lg bg-[#1e2327] p-4 transition-colors hover:bg-[#282f35]"
	onclick={async (event) => {
		// Preserve modified clicks, such as Cmd/Ctrl-click to open a new tab.
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		event.preventDefault();
		const href = event.currentTarget.href;


		recordView(video.videoId);
		refreshWatched();
		window.location.assign(href);
	}}
>
  <div class="relative">
  	<img
  		src={video.thumbnailUrl}
  		alt=""
  		loading="lazy"
  		decoding="async"
  		width="480"
  		height="360"
  		class={`aspect-video w-full object-cover ${isWatched ? 'saturate-5' : ''}`}
  	/>
	 <p class="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold text-white">
		{runTime.minutes}:{runTime.seconds}
		</p>
  </div>


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
