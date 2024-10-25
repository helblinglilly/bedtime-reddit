<script lang="ts">
import { setContext, onMount } from "svelte";
import "../app.css";
import { contextKeys } from "../domain";

setContext(contextKeys.hasTouchscreen, false);

onMount(() => {
	const touchscreen =
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-ignore not in standard library
		navigator.msMaxTouchPoints > 0;
	setContext(contextKeys.hasTouchscreen, touchscreen);
});
</script>

<div class="mx-8 sm:mx-[25%] mt-2">
<slot />
</div>