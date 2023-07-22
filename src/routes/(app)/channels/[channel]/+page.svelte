<script lang="ts">
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { token } from "$lib/stores/auth";
    import { guildSet } from "$lib/stores/guildSet";
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import type {Channel} from "$lib/classes/Guild";

    let channel: Channel = $guildSet.searchChannel($page.params.channel)!;
    //let guild = channel.guild;
    $: {
        channel = $guildSet.searchChannel($page.params.channel)!;
    //let guild = channel.guild;
    }
</script>

{#if channel == null}
    {@debug $page}
{:else}
    {console.log(channel)}
<GuildPage guild={channel.guild}>
    <div class="channel">
        <div class="head">
            <h1>
                {channel.name}
            </h1>
        </div>
        <section>

        </section>
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