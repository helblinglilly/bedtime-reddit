<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { setTouchscreen } from '#lib/touchscreen.js';

	let { children }: LayoutProps = $props();

	const hasTouchscreen = writable(false);
	setTouchscreen(hasTouchscreen);

	onMount(() => {
		hasTouchscreen.set('ontouchstart' in window || navigator.maxTouchPoints > 0);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:rounded focus:bg-slate-800 focus:p-3"
>
	Skip to content
</a>
<div class="mx-auto mt-6 w-full max-w-4xl px-4 sm:px-8">
	{@render children()}
</div>
