<script lang="ts">
    import ButtonAction, {
        ContextMenuItem,
        LinkAction,
    } from "$lib/classes/ContextMenuOption";
    import type { Channel } from "$lib/classes/Guild";
    import type Guild from "$lib/classes/Guild";
    import ContextMenu from "./utility/ContextMenu.svelte";

    export let guild: Guild;

    const getOptions = (channel: Channel) => {
        return [
            new ContextMenuItem(channel.name),
            new ButtonAction("Delete channel", () =>
                alert("you are deleting that channel...")
            ),
        ];
    };

    let selectedIndex: number | null = null;
</script>

<div class="channels">
    {#each guild.channels as channel, index}
        <span id={channel.id}>
            <ContextMenu
                options={getOptions(channel)}
                on:close={() => (selectedIndex = null)}
                visible={selectedIndex == index}
            />
            <a
                href={`/channels/${channel.id}`}
                on:contextmenu|preventDefault={() => (selectedIndex = index)}
                >{channel.name}</a
            >
        </span>
    {/each}
</div>

<style lang="scss">
    .channels {
        display: flex;
        flex-direction: column;
    }
    a {
        color: var(--on-background);
        text-decoration: none;
        font-size: 1em;
    }
</style>
