<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteMap } from 'svelte/reactivity';
	import Video from '#lib/video.svelte';
	import { deeplinks } from '#lib/deeplinks.js';
	import { getTouchscreen } from '#lib/touchscreen.js';
	import type { Video as VideoData } from '#lib/api/types.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const hasTouchscreen = getTouchscreen();

	const days = $derived.by(() => {
		const groups = new SvelteMap<string, VideoData[]>();
		for (const video of data.videos) {
			const day = video.uploadedAt.slice(0, 10);
			const videos = groups.get(day) ?? [];
			videos.push(video);
			groups.set(day, videos);
		}
		return [...groups].sort(([a], [b]) => b.localeCompare(a));
	});

	const channels = $derived(
		[
			...new Map(
				data.videos.map((video) => [
					video.channelId,
					{
						id: video.channelId,
						name: video.channelName
					}
				])
			).values()
		].sort((a, b) => a.name.localeCompare(b.name))
	);

	const dateFormat = new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'long',
		timeZone: 'UTC'
	});
</script>

<svelte:head>
	<title>Bedtime Reddit</title>
	<meta name="description" content="Catch up on the latest videos from your favourite channels." />
</svelte:head>

<header>
	<h1 class="text-3xl font-extrabold">Reddit?</h1>
</header>

<main id="main-content" class="grid gap-8 py-8">
	{#if data.errorMessage}
		<div role="alert" class="rounded-lg border border-red-400/30 bg-red-400/5 p-4">
			<h2 class="font-semibold">Something went wrong</h2>
			<p class="mt-2">{data.errorMessage}</p>
			<a href={resolve('/')} class="mt-3 inline-block underline">Try again</a>
		</div>
	{:else if days.length === 0}
		<p class="rounded-lg border border-white/10 p-6">No videos yet. Check back soon.</p>
	{:else}
		{#each days as [day, videos] (day)}
			<section aria-labelledby={`day-${day}`}>
				<h2 id={`day-${day}`} class="mb-4 text-xl font-semibold">
					<time datetime={day}>{dateFormat.format(new Date(day))}</time>
				</h2>
				<ul class="grid gap-4 sm:grid-cols-2">
					{#each videos as video (video.videoId)}
						<li class="min-w-0"><Video {video} /></li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</main>

{#if channels.length > 0}
	<footer class="border-t border-white/10 py-6">
		<h2 id="channels-heading" class="text-xl font-semibold">Explore the channels</h2>
		<nav aria-labelledby="channels-heading" class="mt-4">
			<ul class="flex flex-wrap gap-x-6 gap-y-3">
				{#each channels as channel (channel.id)}
					<li>
						<!-- eslint-disable svelte/no-navigation-without-resolve -- YouTube URLs use HTTPS or a native app scheme, not SvelteKit routes. -->
						<a
							href={deeplinks($hasTouchscreen).channel(channel.id)}
							class="underline underline-offset-4"
						>
							{channel.name}
						</a>
						<!-- eslint-enable svelte/no-navigation-without-resolve -->
					</li>
				{/each}
			</ul>
		</nav>
	</footer>
{/if}
