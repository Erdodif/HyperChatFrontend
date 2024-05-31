<script lang="ts">
    export let src:string | URL;
</script>

<div>
    <img {src}/>
    <span>Image is here</span>
</div>

<style lang="scss">
    div{
        overflow:auto;
    }
    img{
        width:40em;
        aspect-ratio: 1 / 1;
    }
</style>