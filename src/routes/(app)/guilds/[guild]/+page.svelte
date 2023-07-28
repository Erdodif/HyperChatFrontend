<script lang="ts">
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import GuildPage from "$lib/components/GuildPage.svelte";
    import { _ } from "svelte-i18n";

    let guild: Guild;
    $: guild = $page.data.guild;
</script>

<GuildPage {guild}>
    <details>
        <h1>{guild.name}</h1>

        <h2>{$_("guild.members")}</h2>

        <div>
            {#each guild.memberList as user, index}
                <div>
                    <span>#{index + 1}</span>
                    <span>{user.displayName}</span>
                </div>
            {/each}
        </div>

        <h2>{$_("guild.channels")}</h2>

        <div>
            {#each guild.channelList as channel}
                <div>
                    <a href="/channels/{channel.name}">
                        {channel.name}
                    </a>
                </div>
            {/each}
        </div>
    </details>
</GuildPage>
