<script>
    export let songs;

    import {selection} from "../stores";

    const handleClick = (song) => {
        selection.set(song);
    };
</script>


<div class="list">
    {#each songs as song}
    <p on:click={() => handleClick(song)}>[{song.artist}] {song.title}</p>
    {/each}
</div>
