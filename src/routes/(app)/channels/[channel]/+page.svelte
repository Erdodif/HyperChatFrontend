<script lang="ts">
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { guildSet } from "$lib/stores/guildSet";
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import type Channel from "$lib/classes/Channel";
    import ChatLog from "$lib/components/ChatLog.svelte";
    import { readable } from "svelte/store";

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
    <!--
    <h1>{guild.name}</h1>

    <h2>Members</h2>

    <div>
        {#each guild.members as user, index}
            <div>
                <span>#{index + 1}</span>
                <span>{user.displayName}</span>
            </div>
        {/each}
    </div>

    <h2>Channel</h2>

    <p>
        {channel.name}
    </p>
    -->
</GuildPage>
{/if}

<style lang="scss">
    .channel{
        .head h1{
            font-size: 1em;
        }
    }
</style>