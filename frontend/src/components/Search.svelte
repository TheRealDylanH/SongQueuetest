<script>
    import {search} from "../stores";

    const handleInput = (e) => {
        search.set(e.target.value);
    };

</script>


 
    <input class="search" type="text" placeholder="Search" on:input={handleInput} />


<style>
    input {
        width: 100%;
    }
</style>
