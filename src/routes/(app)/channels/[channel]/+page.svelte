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
        {console.log($guildSet.searchChannel($page.params.channel).chat)}
        <ChatLog chatLog={$guildSet.searchChannel($page.params.channel).chat}/>
    </div>
</GuildPage>
{/if}

<style lang="scss">
    .channel{
        position: relative;
        .head h1{
            font-size: 1em;
        }
    }
</style>