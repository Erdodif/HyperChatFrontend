<script lang="ts">
    import { writable } from "svelte/store";
    import IconButton from "$components/utility/IconButton.svelte";
    import type Guild from "$classes/Guild";
    import Channels from "$components/Channels.svelte";
    import ArrowLeft from "$icons/arrow-left.svelte";
    import ArrowRight from "$icons/arrow-right.svelte";
    import { _ } from "svelte-i18n";

    export let guild: Guild | null;
    let collapsed = false;
    let template = "15ch 2ch 1fr";

    const toogle = () => {
        collapsed = !collapsed;
        if (collapsed) {
            template = "0ch 2ch 1fr";
            return;
        }
        template = "15ch 2ch 1fr";
    };
</script>

{#if guild}
    <section style={`--columns: ${template}`}>
        <div
            class="sidebar"
            style={collapsed ? "width:0; opacity:0; z-index:-1" : ""}
        >
            <span>
                {guild.name}
            </span>
            <hr />
            <Channels {guild} />
        </div>
        <IconButton
            class="collapse"
            on:click={toogle}
            icon={collapsed ? ArrowRight : ArrowLeft}
        />
        <div class="guild">
            <slot />
        </div>
    </section>
{/if}

<style lang="scss">
    .sidebar {
        transition: width 350ms ease-in-out;
        transition: opacity 350ms none;
        transition: z-index 350ms none;
    }
    :global(.collapse) {
        //position: absolute;
        right: 0;
        margin-inline-start: -0.5em;
        margin-block-start: 1em;
        width: 2em;
        height: 2em;
        background-size: contain;
        z-index: 10;
        align-self: baseline;
    }
    section {
        height: 100%;
        position: relative;
        display: grid;
        justify-content: start;
        grid-template-columns: var(--columns);
    }
    span {
        max-width: 100%;
        word-wrap: break-word;
    }
</style>
