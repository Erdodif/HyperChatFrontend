<script lang="ts">
	import IconButton from '$components/utility/IconButton.svelte';
	import { onMount } from 'svelte';
    import "$styles/app.scss";
    type fun = Promise<{default:()=>boolean}>;
    const components = import.meta.glob("/src/lib/assets/icons/**/*")
    
    let ers : Map<string, ConstructorOfATypedSvelteComponent>= new Map();

    onMount(()=>{
       let i = 0;
            for (const path in components){
                components[path]().then(item =>{
                    const Component = (item as {default: ConstructorOfATypedSvelteComponent}).default;
                    ers.set(path, Component);
                });
                i++;
            }
    });
</script>

{#if components}
{#each Object.keys(components) as item, i}
    <IconButton on:click={()=>navigator.clipboard.writeText(item.replace("/src/lib/assets/icons", "$icons"))} icon={undefined}>
        <svelte:component this={ers.get(item)}/>
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