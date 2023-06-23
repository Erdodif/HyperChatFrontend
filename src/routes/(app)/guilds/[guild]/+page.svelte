<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Guild from "$lib/classes/Guild";
    import { guilds } from "$lib/stores/guilds";
    import { onMount } from "svelte";
    import { derived } from "svelte/store";

    export let data;
    let guild = guilds.get(data.guild);

    console.log($page);
</script>

{#if guild !== undefined}
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

    <h2>Channels</h2>

    <div>
        {#each guild.channels as channel}
            <div>
                <a href="/channels/{channel.name}">
                    {channel.name}
                </a>
            </div>
        {/each}
    </div>
{/if}
