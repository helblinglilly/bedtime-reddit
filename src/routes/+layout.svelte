<script lang="ts">
import { setContext, onMount, getContext } from "svelte";
import "../app.css";
import { contextKeys } from "../domain";
import { writable, type Writable } from "svelte/store";

setContext(contextKeys.hasTouchscreen, writable(false));

const hasTouchscreenStore = getContext<Writable<boolean>>(
	contextKeys.hasTouchscreen,
);
onMount(() => {
	const touchscreen =
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-ignore not in standard library
		navigator.msMaxTouchPoints > 0;
	hasTouchscreenStore.set(touchscreen);
});
</script>

<div class="mx-8 sm:mx-[25%] mt-2">
<slot />
</div>