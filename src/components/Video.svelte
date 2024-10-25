<script lang="ts">
import type { Videos as Video } from "./Video.types";

export let video: Video;
</script>

<a href={video.link}>
    <div>
        <h3 class="text-xl">{video.title}</h3>
        <img src={video.thumbnail} />
        <p>{video.uploaded.toLocaleTimeString('en-GB')}</p>
    </div>
</a>