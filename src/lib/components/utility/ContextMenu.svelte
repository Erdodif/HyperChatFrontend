<script lang="ts">
    //Cannot nest it. Don't even try it...
    import Uid from "$lib/classes/Uid";
    import ButtonAction, {
        ContextMenuItem,
        Expandable,
        LinkAction,
        ToogleAction,
    } from "$lib/classes/ContextMenuOption";
    import {fade, blur,fly,slide,scale,crossfade } from "svelte/transition";
    import {writable} from "svelte/store";

    import { createEventDispatcher } from "svelte";
    import { _ } from "svelte-i18n";

    export let options: ContextMenuItem[];
    export let visible: boolean = false;

    const dispatch = createEventDispatcher();

    function close() {
        visible = false;
        dispatch("close");
    }

    let node: HTMLDivElement;

    const keydown = (event: KeyboardEvent) => {
        if (visible && event.key === "Escape") {
            visible = false;
        }
    };

    const mouse = (event: MouseEvent) => {
        if (!visible) {
            return;
        }
        var rect = node.getBoundingClientRect();
        var x = event.clientX;
        var y = event.clientY;
        if (
            rect.top > y ||
            rect.bottom < y ||
            rect.right < x ||
            rect.left > x
        ) {
            close();
        }
    };

    export const openAtCursor = (event: MouseEvent) => {
        open(event.clientX, event.clientY);
    };

    export const open = (x: number, y: number) => {
        node.setAttribute("data-visible", "true");
        node.style.top = `0`;
        node.style.left = `0`;
        if (x + node.clientWidth > document.body.offsetWidth - 20) {
            x = window.innerWidth - node.clientWidth - 25;
        }
        if (y + node.clientHeight > document.body.offsetHeight - 20) {
            y = window.innerHeight - node.clientHeight - 25;
        }
        node.style.top = `${y}px`;
        node.style.left = `${x}px`;
        visible = true;
    };

    let _counter = writable(0);
</script>

<svelte:document
    on:keydown|capture={keydown}
    on:click|capture={mouse}
    on:contextmenu|capture={mouse}
/>

<div id="context-menu" data-visible={visible} bind:this={node}>
    {#if visible}
    <div id="context-menu-content" in:slide={{axis:'y', duration:40* options.length}} on:introstart={()=>$_counter=0} on:outroend={()=>$_counter=0}>
    {#each options as option, i}
        {#if option.icon}
            <img src={option.icon} alt={option.name} />
        {/if}
        <span class={option.center?"context-option centered":"context-option"}>
            {#if option instanceof Expandable}
                <svelte:self
                    options={option.options}
                    bind:visible={option.expanded}
                />
                <button on:click={option.open} class="expand">
                    {option.name}
                </button>
            {:else if option instanceof ToogleAction}
                <input
                    type="checkbox"
                    name={option.isFor}
                    id={Uid.currentId()}
                    bind:checked={option.isSet}
                />
                <label for={Uid.getId()}>
                    {option.name}
                </label>
            {:else if option instanceof ButtonAction}
                <button on:click={()=>{option.action(); if(option.autoClose) close()}}>
                    {option.name}
                </button>
            {:else if option instanceof LinkAction}
                <a
                    href={option.href}
                    target={option.newTab ? `_blank` : `_self`}
                >
                    {option.name}
                </a>
            {:else}
                <div class="text-option">{option.name}</div>
            {/if}
        </span>
    {:else}
        <span class="context-option">{$_("errors.contextmenu.no-option")}</span>
    {/each}
    </div>
    {/if}
</div>

<style lang="scss">
    .centered{
        margin-inline:auto;
        max-width:100%;
    }
    #context-menu {
        z-index: 999;
        user-select: none;
        font-size: 0.925em;
        max-width: 40ch;
        min-width: 13ch;
        position: fixed;
        display: none;
        box-sizing: border-box;
        #context-menu-content{
            background-color: var(--secondary-variant);
            box-sizing: border-box;
            padding-block: 0.1ch;
            border: 0.15ch solid var(--on-secondary);
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            .context-option {
                padding-block: 0.1ch;
                padding-inline-start: calc(1.2em + 0.8ch);
                padding-inline-end: 0.8ch;
            }
        }
        &[data-visible="true"] {
            display:block;
        }
        color: var(--on-secondary);
        img,
        input {
            position: absolute;
            left: 0.4ch;
            max-width: 1.125em;
            max-height: 1.125em;
            height: 100%;
        }
        label {
            cursor: pointer;
            width: 100%;
            &:hover {
                filter: drop-shadow(0.1ch 0.1ch 0.2ch var(--primary));
            }
        }
        button {
            margin-inline: auto;
            &.expand {
                cursor: pointer;
                width: 100%;
                padding: 0;
                text-align: left;
                border: 0;
                background: transparent;
                font-size: 1em;
                &:hover,
                &:focus,
                &:focus-visible,
                &:focus-within {
                    color: unset;
                    filter: drop-shadow(0.1ch 0.1ch 0.2ch var(--primary));
                }
            }
        }
        .text-option{
            overflow-x:hidden;
            overflow-y:auto;
            overflow-wrap:break-word;
        }
    }
</style>
