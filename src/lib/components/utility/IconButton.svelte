<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let width = "100%";
    export let icon : ConstructorOfATypedSvelteComponent | undefined;
    export let href: string | null = null;
    export let id = "";

    const dispatch = createEventDispatcher();
</script>

{#if icon}
    {#if href}
        <a {href} {id}>
            <svelte:component this={icon} {width} height={width}/>
        </a>
    {:else}
        <button {id} class={"icon-button " + $$props.class} on:click={e=>dispatch('click',e)}>
            <svelte:component this={icon} {width} height={width}/>
        </button>
    {/if}
{:else}
    {#if href}
        <a {href} {id}>
            <slot {width} height={width}/>
        </a>
    {:else}
        <button {id} class={"icon-button " + $$props.class} on:click={e=>dispatch('click',e)}>
            <slot {width} height={width}/>
        </button>
    {/if}
{/if}

<style lang="scss">
    .icon-button{
        all:unset;
        padding: 0.2ch;
        cursor:pointer;
        :global(svg){
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
