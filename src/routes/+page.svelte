<script lang="ts">
import type { PageData } from "./$types";

export let data: PageData;
let { body, errorMessage } = data;
</script>

<h1>Reddit?</h1>
<h1>{errorMessage}</h1>
<h1>{JSON.stringify(body)}</h1>