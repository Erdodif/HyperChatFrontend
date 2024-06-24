<script lang="ts">
	import GuildIcon from '$components/guilds/GuildIcon.svelte';
    // Classes
    import type Guild from "$classes/Guild";
    // Stores
    import { guildSet } from "$stores/guildSet";
    //Icons
	import IconButton from '$components/utility/IconButton.svelte';
    import AddIcon from "$icons/add.svelte";

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
    <IconButton icon={AddIcon} src="/guilds/create" id="create"/>
</div>

<style lang="scss">
    .guilds {
        height:100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: start;
        gap: 0.275em;
        overflow-x: hidden;
        isolation: isolate;
        box-sizing:border-box;
        :global(#create) {
            user-select: none;
            margin-inline: 0.125em;
            aspect-ratio: 1 / 1;
        }
    }
</style>
