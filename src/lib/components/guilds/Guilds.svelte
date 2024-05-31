<script lang="ts">
	import GuildIcon from '$components/guilds/GuildIcon.svelte';
    // Classes
    import type Guild from "$classes/Guild";
    // Stores
    import { guildSet } from "$stores/guildSet";

    let activeIndex: number | null = null;
    let guilds = [];

    $: guilds = $guildSet.guildsArray
</script>

<div class="guilds">
    {#each guilds as guild, i}
        {#if guild.id}
            <GuildIcon {guild} id={i} {activeIndex} />
        {/if}
    {/each}
    <a href="/guilds/create" id="create">+</a>
</div>

<style lang="scss">
    .guilds {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 0.275em;
        overflow-x: hidden;
        isolation: isolate;
        box-sizing:border-box;
        #create {
            line-height: 1.625em;
            user-select: none;
            font-weight: bold;
            font-size: 1.5em;
            color: var(--background);
            background-color: var(--primary);
            border: 0.1ch solid var(--primary-variant);
            width: 80%;
            margin-inline: auto;
            aspect-ratio: 1 / 1;
            text-decoration: none;
            text-align: center;
            border-radius: 35%;
            &:hover {
                background-color: var(--primary-variant);
                border: 0.1ch solid var(--secondary-variant);
                color: var(--secondary);
                filter: drop-shadow(0em 0em 0.075em var(--secondary));
                transition: all 170ms ease-in-out;
            }
        }
    }
</style>
