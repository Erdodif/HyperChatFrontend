<script lang="ts">
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { guildSet } from "$lib/stores/guildSet";
    import { initializing } from "$lib/stores/socketHandler";
    import { _ } from "svelte-i18n";

    let guild: Guild;

    $: guild = $guildSet.guilds.get($page.params.guild);
</script>

{#if $initializing}
    <span>Loading</span>
{:else if guild}
    <GuildPage {guild}>
        <h1>{guild.name}</h1>

        <h2>{$_("guild.members")}</h2>

        <div>
            {#each guild.memberList as member, index}
                <div>
                    <span>#{index + 1}</span>
                    <span>{member.nickname ?? member.user.displayName}</span>
                </div>
            {/each}
        </div>

        <h2>{$_("guild.channels")}</h2>

        <div>
            {#each guild.channelList as channel}
                <div>
                    <a href="/channels/{channel.id}">
                        {channel.name}
                    </a>
                </div>
            {/each}
        </div>
    </GuildPage>
{:else}
    <h1>404 - {$_("errors.guild.missing")}</h1>
{/if}
