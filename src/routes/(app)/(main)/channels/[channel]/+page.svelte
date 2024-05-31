<script lang="ts">
    // Types
    import type Channel from "$classes/Channel";
    // Components
    import GuildPage from "$components/guilds/GuildPage.svelte";
    import ChatLog from "$components/chat/ChatLog.svelte";
    // Stores
    import { initializing, onSocketFinished } from "$stores/socketHandler";
    import { guildSet } from "$stores/guildSet";
    import { page } from "$app/stores";
    import { _ } from "svelte-i18n";
    // Navigation
    import { slide, fade  } from "svelte/transition"
    import { goto } from "$app/navigation";

    let channel: Channel;

    onSocketFinished(() => {
        channel = $guildSet.searchChannel($page.params.channel);
    });

    $: channel = $guildSet.searchChannel($page.params.channel);
</script>

{#if $initializing}
    loading
{:else if channel}
    <GuildPage guild={channel.guild}>
        <div class="channel">
            <div class="head">
                <h1>
                    {channel.name}
                </h1>
            </div>
            {#key channel}
                <div class="chat">
                    <ChatLog chatInit={channel.chat} />
                </div>
            {/key}
        </div>
    </GuildPage>
{:else}
    <span in:fade={{duration:450}} on:introend={()=> setTimeout(() => {goto("/")}, 1000)}>
        {$_("errors.channel.not_found")}
    </span>
{/if}

<style lang="scss">
    .channel {
        position: relative;
        height: 100%;
        display: grid;
        grid-template-rows: 1.5em 1fr;
        .head h1 {
            font-size: 1em;
            margin-block: 0.375em;
        }
    }
</style>
