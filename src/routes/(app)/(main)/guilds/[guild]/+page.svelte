<script lang="ts">
    // Components
    import GuildPage from "$components/guilds/GuildPage.svelte";
    // Classes
    import Rest from "$classes/Rest";
    import Guild from "$classes/Guild";
    // Stores
    import { page } from "$app/stores";
    import { guildSet } from "$stores/guildSet";
    import { initializing } from "$stores/socketHandler";
    import { _ } from "svelte-i18n";
    import { writable } from "svelte/store";
    
    let guild: Guild;
    let checked = writable(false)
    $: {
        guild = $guildSet.guilds.get($page.params.guild)!;
        if(!guild && !$checked){
            Rest.getJsonFromServer(`guilds/${$page.params.guild}`)
            .then(response => {
                guild = new Guild(response.id, response.name, response.owner_id);
            });
            $checked = true;
        }
    }
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
