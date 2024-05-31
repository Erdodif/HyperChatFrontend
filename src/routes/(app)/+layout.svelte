<script lang="ts">
    // Types
    import Guild from "$classes/Guild";
    import User from "$classes/User";
    import Member from "$classes/Member";
    import { ChatMessage } from "$classes/Message";
    import Rest, { RestMethod } from "$classes/Rest";
    import { EventHandler } from "$classes/SocketHandler";
    // Stores
    import { guildSet } from "$stores/guildSet";
    import { user } from "$stores/auth";
    import { token } from "$stores/auth";
    import { page } from "$app/stores";
    import { isLoading } from "svelte-i18n";
    import socketHandler, { initializing } from "$stores/socketHandler";
    // Utility
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    // Assets
    import userPreferences, {
        UserPreferences,
        type PreferenceJson,
    } from "$stores/userPreferences";
    import { locale, locales } from "svelte-i18n";

    let waiting: number = 1;

    let handlerBundle = [
        new EventHandler("INVALID_SESSION", () => {
            goto(`/login?from=${$page.url.pathname}`);
        }),
        new EventHandler("HELLO", (event) => {
            $socketHandler.startHeartBeats(event.heartbeat_interval);
        }),
        new EventHandler("HEARTBEAT_ACK", () => {}),
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
        new EventHandler("CHANNEL_CREATE", (event) => {
            let guild = guildSet.get(event.quild_id);
            guildSet.addChannel(guild.id, new Channel(event.id, event.name, event.type, guild));
        }),
        new EventHandler("GUILD_REMOVE", (event) => {
            guildSet.removeGuild(event.id);
            if($page.params && $page.params.guild === event.id){
                goto(`/guilds`);
            }
        }),
        new EventHandler("CHANNEL_REMOVE", (event) => {
            guildSet.removeChannel(event.guild_id, event.id);
            if($page.params && $page.params.channel === event.id){
                goto(`/guilds/${event.guild_id}`);
            }
        }),
        new EventHandler("MESSAGE_CREATE", (event) => {
            let message: ChatMessage = ChatMessage.fromJson(
                event,
                guildSet.searchChannel(event.channel_id)
            );
            guildSet.pushToChatLog(event.channel_id, message, event.nonce);
        }),
        new EventHandler("INVALID_SESSION",(event) => {
            console.error("Invalid session in SocketHandler, which is unhandled.");
        })
    ];

    onMount(async () => {
        if (!(await Rest.isTokenValid("users/@me"))) {
            goto(`/login?from=${$page.url.pathname}`);
            return;
        }
        userPreferences.fromJson(
            (await Rest.getJsonBigint(
                "prefs",
                RestMethod.GET,
                "flags"
            )) as unknown as PreferenceJson,
            true
        );
        socketHandler.init($token, handlerBundle);
    });

    $: {
        Rest.token = $token;
    }
</script>

<div data-layout={$userPreferences ? $userPreferences.styleLayout : "normal"}>
    <slot />
</div>