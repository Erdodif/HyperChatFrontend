<script lang="ts">
	import Guild from '$classes/Guild';
    import { _ } from "svelte-i18n";
    import { user } from "$stores/auth";
    // Icons
    import Icon_chat from "$icons/chat/bubble.svelte";
    // Components
    import ContextMenu from "$components/utility/ContextMenu.svelte";
    import ButtonAction, {
        ContextMenuItem,
        LinkAction,
    } from "$classes/ContextMenuOption";
    import Rest, { RestMethod } from "$classes/Rest";

    export let guild:Guild;
    export let activeIndex: number | null;
    export let id:number;

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

    const getShortName = ()=>{
        if(guild.name.match(/[\w]+[ ][\w]+/)?.length !== 0){
            let names: string[] = guild.name.split(" ").filter(str => str.length > 0);
            let first = (names[0][0]??"").toUpperCase();
            let second = (names[0][1]?? "").toLowerCase();
            if(names[1] !== undefined && names[1] !== ""){
                second = names[1][0].toLowerCase();
            }
            return first + second;
        }
        else{
            return "?";
        }
    }
</script>

<div class="guild">
        <ContextMenu
        options={getOptions(guild)}
        visible={activeIndex == id}
        on:close={() => (activeIndex = null)}
    />
    <a
        id={guild.id}
        href="/guilds/{guild.id}"
        on:contextmenu|preventDefault={() => (activeIndex = id)}
    >
        <Icon_chat class="icon guild-icon"/>
        <span class="short">
            {getShortName()}
        </span>
        <span class="name">
          {guild.name}
        </span>
    </a>
</div>

<style lang="scss">
    .guild {
        display: grid;
        user-select: none;
        margin: 0.225em;
        aspect-ratio: 1 / 1;
        grid-template-areas: "center";
        color: var(--primary);
        --animation: 150ms ease-in-out;
        a{
            border-radius: .5em;
            text-decoration:none;
            width:100%;
            height:100%;
            border: 0.2ch dashed transparent;
            display:grid;
            transition: border var(--animation);
            .name {
                display: none;
            }
            :global(.guild-icon){
                grid-area:center;
                transition: color var(--animation);
            }
            .short{
                color: var(--primary);
                grid-area:center;
                font-size:1em;
                font-weight:bold;
                margin:auto;
                transition: color var(--animation);
            }
            &:hover {
                :global(.guild-icon){
                    color: var(--secondary);
                }
                border: 0.2ch dashed var(--secondary);
                .short{
                    color: var(--secondary);
                }
                .name {
                    margin-block-start:-1em;
                    max-width: 20ch;
                    text-overflow:ellipsis;
                    overflow: hidden;
                    white-space:nowrap;
                    width: max-content;
                    border: .3ch solid var(--secondary-variant);
                    display: block;
                    position: absolute;
                    margin-block-start:.15em;
                    left: 3em;
                    font-size: 1em;
                    background: var(--background);
                    padding-inline: 1ch;
                    padding-block: .5ch;
                    border-radius: 1.3ch;
                    color: var(--on-background);
                }
            }
        }
    }

</style>
