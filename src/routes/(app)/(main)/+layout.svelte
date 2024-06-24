<script lang="ts">
	import IconButton from '$components/utility/IconButton.svelte';
    // Components
    import Navigation from "$components/Navigation.svelte";
    import Guilds from "$components/guilds/Guilds.svelte";
    import Settings from "$icons/Settings.svelte";
    import Channel from "$classes/Channel";
    //
    import userPreferences from "$stores/userPreferences";
    import { isLoading } from "svelte-i18n";
    import socketHandler, { initializing } from "$stores/socketHandler";
    import { _ } from "svelte-i18n";
</script>

<div class="page" data-layout={$userPreferences ? $userPreferences.styleLayout : "normal"}>
    <header class="nav">
        <Navigation />
    </header>
    <main>
        {#if $isLoading}
            <span>...</span>
        {:else if $socketHandler === null}
            <span>{$_("guild.loading")}</span>
        {:else}
            <slot />
        {/if}
    </main>
    <aside>
        <div class="guilds">
            <Guilds />
        </div>
        <div class="options">
            <hr />
            <IconButton href="/settings" class="settings" icon={Settings} data-sveltekit-reload/>
        </div>
    </aside>
</div>

<style lang="scss">
    :global(:root) {
        color: var(--on-background);
        background-color: var(--background);
    }
.page {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    max-height: 100vh;
    grid-template-areas: "head head" "side main";
    align-items: stretch;
    background-color: var(--background);
    &[data-layout="comfy"]{
        grid-template-rows: 2.775rem calc(100vh - 2.775em);
        @supports (max-height: 100dvh) {
            max-height: 100dvh;
            grid-template-rows: 2.775rem calc(100dvh - 2.775rem);
        }
        grid-template-columns: 4em 1fr;
    }
    &[data-layout="normal"]{
        grid-template-rows: 2.275rem calc(100vh - 2.275rem);
        @supports (max-height: 100dvh) {
            max-height: 100dvh;
            grid-template-rows: 2.275rem calc(100dvh - 2.275rem);
        }
        grid-template-columns: 3em 1fr;
    }
    &[data-layout="compact"]{
        grid-template-rows: 2.175rem calc(100vh - 2.175rem);
        @supports (max-height: 100dvh) {
            max-height: 100dvh;
            grid-template-rows: 2.175rem calc(100dvh - 2.175rem);
        }
        grid-template-columns: 2.5em 1fr;
    }
    .nav {
        grid-area: head;
        background-color: var(--surface);
    }
    main {
        position: relative;
        max-width: 100%;
        max-height: 100%;
        height: 100%;
        grid-area: main;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }
    aside {
        grid-area: side;
        border-top: 0.2em solid var(--background);
        display: grid;
        grid-template-rows: 1fr min-content;
        background-color: var(--surface);
        .guilds {
            min-height: 100%;
            overflow-y: auto;
        }
        .options {
            margin-inline: 0.275em;
            margin-block: 0em;
            hr {
                border-color: var(--secondary-variant);
                border-width: 0.1ch;
            }
            :global(a) {
                display: block;
                margin: 0;
                padding: 0;
                width: 100%;
            }
        }
    }
}
</style>
