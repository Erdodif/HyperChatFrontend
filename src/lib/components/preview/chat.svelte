<script lang="ts">
    export let src:string | URL;
    let source = (src instanceof URL) ? src.toString() : src;
</script>

<div>
    <img src={source} alt="preview"/>
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