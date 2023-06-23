<script lang="ts">
    export let data;
    let guild = data.guild;
    let channel = data.channel;

    $: {
        guild = data.guild;
        channel = data.channel;
    }
</script>

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
<div>
</div>
