<script lang="ts">
	import IconButton from '$components/utility/IconButton.svelte';
	import { onMount } from 'svelte';
    import "$styles/app.scss";
    const components = import.meta.glob("/src/lib/assets/icons/**/*")
    
    let ers = new Map();

    onMount(()=>{
       let i = 0;
            for (const path in components){
                console.log(ers[path]);
                components[path]().then(item =>{
                    const Component = item?.default;
                    ers[path] = Component;
                });
                i++;
            }
    });
</script>

{#if components}
{#each Object.keys(components) as item, i}
    <IconButton on:click={()=>navigator.clipboard.writeText(item.replace("/src/lib/assets/icons", "$icons"))}>
        <svelte:component this={ers[item]}/>
        <span>#{i} {item.replace("/src/lib/assets/icons", "$icons")}</span>
    </IconButton>
{/each}
{/if}
<style lang="scss">
    :global(body){
        padding-block-start: 1em;
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
        background: var(--background);
    }
    :global(span){
        position: fixed;
        top:0;
        left:0;
        z-index: 1;
        padding: .2em;
        background: var(--background);
        display:none;
    }
    :global(:hover >span){
        display: block;
        color: var(--secondary);
        font-size: 1em;
    }
</style>