<script lang="ts">
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { guildSet } from "$lib/stores/guildSet";
    import { page } from "$app/stores";
    import ChatLog from "$lib/components/ChatLog.svelte";
    import { initializing } from "$lib/stores/socketHandler";
    import type Channel from "$lib/classes/Channel";

    let channel: Channel;
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
            <div class="chat">
                <ChatLog chatLog={channel.chat} />
            </div>
        </div>
    </GuildPage>
{:else}
    <span>404</span>
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
