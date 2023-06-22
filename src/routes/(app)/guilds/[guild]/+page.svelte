<script lang="ts">
    export let data;
    let guild = data.guild;

    $: guild = data.guild;
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
                <span>
                    {channel.name}
                </span>
            </div>
        {/each}
    </div>
{/if}
