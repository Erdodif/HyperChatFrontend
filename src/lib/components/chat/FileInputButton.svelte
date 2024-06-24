<script lang="ts">
    import FileIcon from "$icons/chat/archetype/archive.svelte";
    export let width = "2rem";
    export let element: HTMLInputElement;
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

</script>

<label class={"fileinput " + $$props.class} style="width:{width}; height:{width};">
    <FileIcon/>
    <input
        type="file"
        bind:this={element}
        multiple
        on:change={e => dispatch('change',e)}
    />
</label>

<style lang="scss">
    .fileinput{
        align-self: center;
        margin:auto;
        padding: 0.2ch;
        cursor:pointer;
        :global(svg){
            margin:0;
            width:  100%;
            height: 100%;
            color: var(--primary) !important;
            stroke: var(--primary) !important;
        }
        &:hover :global(svg){
            transition: color 150ms ease-in;
            transition: filter 350ms linear;
            color: var(--secondary) !important;
            filter: drop-shadow(var(--primary) 0 0 1ch);
        }
    }
</style>


