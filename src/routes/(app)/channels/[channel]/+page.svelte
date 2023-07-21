<script lang="ts">
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { token } from "$lib/stores/auth";
    import { guildSet } from "$lib/stores/guildSet";
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import type {Channel} from "$lib/classes/Guild";

    let channel: Channel = $guildSet.searchChannel($page.data.channel)!;
    //let guild = channel.guild;
    let guild:Guild = channel.guild;
    $: {
    }
</script>

<GuildPage {guild}>
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
