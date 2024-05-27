<script lang="ts">
    import clay from "$lib/assets/chat_bubble_clay.png";
    import blue from "$lib/assets/chat_bubble_blue.png";
    import purple from "$lib/assets/chat_bubble_purple.png";
    import gold from "$lib/assets/chat_bubble_gold.png";
    import { user } from "$lib/stores/auth";
    import { guildSet } from "$lib/stores/guildSet";
    import ContextMenu from "./utility/ContextMenu.svelte";
    import ButtonAction, {
        ContextMenuItem,
        LinkAction,
    } from "$lib/classes/ContextMenuOption";
    import type Guild from "$lib/classes/Guild";
    import Rest, { RestMethod } from "$lib/classes/Rest";
    import { _ } from "svelte-i18n";
    import {writable} from "svelte/store";

    const randomImage = () => {
        switch (Math.floor(Math.random() * 4)) {
            default:
                return clay;
            case 1:
                return blue;
            case 2:
                return purple;
            case 3:
                return gold;
        }
    };

    let activeIndex: number | null = null;
    const getOptions = (guild: Guild) => [
        new ContextMenuItem(guild.id),
        new ContextMenuItem(guild.name),
        new LinkAction(
            $_("guild.open-new-tab"),
            `/guilds/${guild.id}`,
            null,
            false,
            true
        ),
        guild.ownerId == $user.id
            ? new ButtonAction($_("guild.delete"), () => deleteGuild(guild), null, false)
            : new ContextMenuItem($_("guild.cannot-delete"), null, true),
    ];

    const deleteGuild = async (guild: Guild) => {
        if (
            confirm(
                $_("guild.delete-confirm", {
                    values: { name: guild.name, id: guild.id },
                })
                //`Are you really going to delete ${guild.name} (${guild.id})?\nThis step is irreversible tho...`
            )
        ) {
            const response = await Rest.sendToServer(
                `guilds/${guild.id}`,
                null,
                RestMethod.DELETE
            );
            if (response.ok) {
                alert($_("guild.deleted"));
                return;
            }
            alert($_("errors.guild.delete-failed"));
            console.log(response);
        }
    };

    let guilds = [];

    $: guilds = $guildSet.guildsArray
</script>

<div class="guilds">
    {#each guilds as guild, i}
        {#if guild.id}
        <div
            class="guild">
            <ContextMenu
                options={getOptions(guild)}
                visible={activeIndex == i}
                on:close={() => (activeIndex = null)}
            />
            <a
                id={guild.id}
                href="/guilds/{guild.id}"
                on:contextmenu|preventDefault={() => (activeIndex = i)}
            >
                <img src={randomImage()} alt={guild.name} />
                <span class="name">
                  {guild.name}
                </span>
            </a>
        </div>
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
        .guild {
            display: grid;
            user-select: none;
            margin: 0.225em;
            aspect-ratio: 1 / 1;
            border-radius: 1em;
            img {
                max-height: 90%;
                max-width: 90%;
                width: auto;
                margin-inline: auto;
                margin-block: 0.175em;
            }
            .name {
                display: none;
            }
            a{
                width:100%;
                height:100%;
                &:hover {
                    border: 0.1ch dashed var(--primary);
                    .name {
                        margin-block-start:-1em;
                        max-width: 20ch;
                        text-overflow:ellipsis;
                        overflow: hidden;
                        white-space:nowrap;
                        width: max-content;
                        border: .1ch solid var(--primary-variant);
                        display: block;
                        position: absolute;
                        left: 4em;
                        font-size: 0.675em;
                        background: var(--background);
                        padding-inline: 1ch;
                        padding-block: .5ch;
                        border-radius: 1.3ch;
                        color: var(--on-background);
                    }
                }
            }
        }
    }
</style>
