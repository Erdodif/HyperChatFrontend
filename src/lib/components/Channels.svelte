<script lang="ts">
    import ButtonAction, {
        ContextMenuItem,
        LinkAction,
    } from "$lib/classes/ContextMenuOption";
    import type Guild from "$lib/classes/Guild";
    import ContextMenu from "./utility/ContextMenu.svelte";
    import {page} from "$app/stores";
    import type Channel from "$lib/classes/Channel";
    import { _ } from "svelte-i18n";
    import Rest, { RestMethod } from "$lib/classes/Rest";

    export let guild: Guild;

    const getOptions = (channel: Channel) => {
        return [
            new ContextMenuItem(channel.name),
            new ButtonAction($_("channel.delete"), () =>
                Rest.getJsonFromServer(`channels/${channel.id}`,RestMethod.DELETE)
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
