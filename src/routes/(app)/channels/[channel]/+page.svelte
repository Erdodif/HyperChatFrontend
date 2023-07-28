<script lang="ts">
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { guildSet } from "$lib/stores/guildSet";
    import { page } from "$app/stores";
    import ChatLog from "$lib/components/ChatLog.svelte";
</script>

{#if $guildSet.searchChannel($page.params.channel)}
    <GuildPage guild={$guildSet.searchChannel($page.params.channel).guild}>
        <div class="channel">
            <div class="head">
                <h1>
                    {$guildSet.searchChannel($page.params.channel).name}
                </h1>
            </div>
            <div class="chat">
                <ChatLog
                    chatLog={$guildSet.searchChannel($page.params.channel).chat}
                />
            </div>
        </div>
    </GuildPage>
{/if}

<style lang="scss">
    .channel {
        position: relative;
        height: 100%;
        display: grid;
        grid-template-rows: 1.5em 1fr;
        .head h1 {
            font-size: 1em;
            margin-block:.375em;
        }
    }
</style>
