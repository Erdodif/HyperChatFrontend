<script lang="ts">
    // Components
    import ContextMenu from "$components/utility/ContextMenu.svelte";
    import ButtonAction, {
        ContextMenuItem,
        LinkAction,
    } from "$classes/ContextMenuOption";
    // Classes
    import type Guild from "$classes/Guild";
    import type Channel from "$classes/Channel";
    import Rest, { RestMethod } from "$classes/Rest";
    // Stores
    import {page} from "$app/stores";
    import { _ } from "svelte-i18n";

    export let guild: Guild;

    const getOptions = (channel: Channel) => {
        return [
            new ContextMenuItem(channel.name),
            new ButtonAction($_("channel.delete"), () =>
                Rest.sendToServer(`channels/${channel.id}`, null, RestMethod.DELETE)
            ),
        ];
    };

    let selectedIndex: number | null = null;
</script>

<div class="channels">
    {#each guild.channelList as channel, index}
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
    <span id="new-channel">
        <a href={`/guilds/${guild.id}/create-channel`}>{$_("channel.create")}</a>
    </span>
</div>

<style lang="scss">
    .channels {
        display: flex;
        flex-direction: column;
    }
    span{
        margin-block:.5em;
    }
    a {
        color: var(--on-background);
        text-decoration: none;
        font-size: 1em;
    }
</style>
