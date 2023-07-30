<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Guilds from "$lib/components/Guilds.svelte";
    import { EventHandler } from "$lib/classes/SocketHandler";
    import { onMount } from "svelte";
    import { user } from "$lib/stores/auth";
    import User from "$lib/classes/User";
    import Guild from "$lib/classes/Guild";
    import { guildSet } from "$lib/stores/guildSet";
    import { token } from "$lib/stores/auth";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import Rest from "$lib/classes/Rest";
    import Member from "$lib/classes/Member";
    import { ChatMessage } from "$lib/classes/Message";
    import { isLoading } from "svelte-i18n";
    import socketHandler, { initializing } from "$lib/stores/socketHandler";

    let waiting: number = 1;

    let handlerBundle = [
        new EventHandler("INVALID_SESSION", () => {
            goto(`/login?from=${$page.url.pathname}`);
        }),
        new EventHandler("READY", (event) => {
            $initializing = true;
            $user = User.fromJsonOrRedirect(event.user, $page.url.pathname);
            waiting = event.guilds;
            for (const guild of event.guilds) {
                guildSet.set(Guild.fromJson(guild));
            }
        }),
        new EventHandler("GUILD_CREATE", (event) => {
            guildSet.set(Guild.fromGuildCreate(event));
            if (waiting > 0) {
                waiting--;
            }
            $initializing = waiting <= 0;
        }),
        new EventHandler("GUILD_REMOVE", (event) => {
            $guildSet.remove(event.id);
        }),
        new EventHandler("MESSAGE_CREATE", (event) => {
            let author: Member = Member.fromJson(event.author);
            let message: ChatMessage = new ChatMessage(
                author,
                event.content,
                event.id
            );
            guildSet.pushToChatLog(event.channel_id, message, event.nonce);
        }),
    ];

    onMount(async () => {
        socketHandler.init($token, handlerBundle);
    });

    $: {
        Rest.token = $token;
    }
</script>

<div class="page">
    <header class="nav">
        <Navigation />
    </header>
    <main>
        {#if $isLoading || $socketHandler === null}
            <span>Loading</span>
        {:else}
            <slot />
        {/if}
    </main>
    <aside>
        <Guilds />
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
        grid-template-areas: "head head" "side main";
        grid-template-columns: 3em 1fr;
        align-items: stretch;
        grid-template-rows: 2.175em 1fr min-content;
        background-color: var(--background);
        .nav {
            grid-area: head;
            background-color: var(--surface);
        }
        main {
            position: relative;
            max-width: 100%;
            grid-area: main;
        }
        aside {
            grid-area: side;
            border-top: 0.2em solid var(--background);
            background-color: var(--surface);
        }
    }
</style>
