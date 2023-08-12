<script lang="ts">
    // Components
    import Navigation from "$lib/components/Navigation.svelte";
    import Guilds from "$lib/components/Guilds.svelte";
    // Types
    import Guild from "$lib/classes/Guild";
    import User from "$lib/classes/User";
    import Member from "$lib/classes/Member";
    import { ChatMessage } from "$lib/classes/Message";
    import Rest from "$lib/classes/Rest";
    import { EventHandler } from "$lib/classes/SocketHandler";
    // Stores
    import { guildSet } from "$lib/stores/guildSet";
    import { user } from "$lib/stores/auth";
    import { token } from "$lib/stores/auth";
    import { page } from "$app/stores";
    import { isLoading } from "svelte-i18n";
    import socketHandler, { initializing } from "$lib/stores/socketHandler";
    // Utility
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    // Assets
    import Settings from "$lib/assets/icons/Settings.svelte";

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
            let message: ChatMessage = ChatMessage.fromJson(event,guildSet.searchChannel(event.channel_id));
            guildSet.pushToChatLog(event.channel_id, message, event.nonce);
        }),
    ];

    onMount(async () => {
        if (!(await Rest.isTokenValid("users/@self"))) {
            goto(`/login?from=${$page.url.pathname}`);
        }
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
        <div class="guilds">
            <Guilds />
        </div>
        <div class="options">
            <hr />
            <a href="/options">
                <Settings className="settings" />
            </a>
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
                a {
                    display: block;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: auto;
                    background-color: var(--secondary);
                    border-radius: 1ch;
                    :global(svg.settings) {
                        width: 100%;
                        height: auto;
                        color: var(--on-secondary);
                    }
                    &:hover {
                        background-color: color-mix(
                            in srgb,
                            var(--secondary-variant) 25%,
                            var(--background)
                        );
                        :global(svg.settings) {
                            color: var(--secondary);
                        }
                    }
                }
            }
        }
    }
</style>
