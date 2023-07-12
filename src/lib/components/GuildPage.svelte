<script lang="ts">
    import type Guild from "$lib/classes/Guild";
    import Channels from "./Channels.svelte";

    export let guild: Guild;
</script>

<section>
    <div class="sidebar">
        <Channels {guild} />
    </div>
    <div class="guild">
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
    </div>
</section>

<style lang="scss">
    section {
        display: grid;
        grid-template-columns: 15ch 1fr;
    }
</style>
