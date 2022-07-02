<script>
    export let songs;
</script>

<div class="list">
    {#each songs as {artist, title}}
    <p>[{artist}] {title}</p>
    {/each}
</div>
