<script lang="ts">
    //Cannot nest it. Don't even try it...
    import Uid from "$lib/classes/Uid";
    import ButtonAction, {
        ContextMenuItem,
        Expandable,
        LinkAction,
        ToogleAction,
    } from "$lib/classes/ContextMenuOption";
    export let options: ContextMenuItem[];
    export let visible: boolean = false;

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
            visible = false;
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
</script>

<svelte:document
    on:keydown|preventDefault={keydown}
    on:click|capture={mouse}
    on:contextmenu|capture={mouse}
/>

<div id="context-menu" data-visible={visible} bind:this={node}>
    {#if !options || !options.length}
        <span class="context-option">No Actions available</span>
    {/if}
    {#each options as option}
        <span class="context-option">
            {#if option instanceof Expandable}
                <svelte:self
                    options={option.options}
                    bind:visible={option.expanded}
                />
                <button on:click={option.open} class="expand">
                    {option.name}
                </button>
            {:else if option instanceof ToogleAction}
                <label for={Uid.getId()}>
                    {option.name}
                </label>
                <input
                    type="checkbox"
                    name={option.isFor}
                    id={Uid.currentId()}
                    bind:checked={option.isSet}
                />
            {:else if option instanceof ButtonAction}
                <button on:click={option.action}>
                    {option.name}
                </button>
            {:else if option instanceof LinkAction}
                <a href={option.href}>
                    {option.name}
                </a>
            {:else}
                <span>{option.name}</span>
            {/if}
            {#if option.icon}
                <img src={option.icon} alt={option.name} />
            {/if}
        </span>

            {#if option instanceof ContextAction}
                <button class="context-option clickable" on:click={option.action}>
                    {option.name}
                </button>
            {:else if option instanceof LinkAction}
                <a class="context-option" href={option.href}>{option.name}</a>
            {:else if option instanceof Expandable}
                <input class="context-option" type="button" value={option.name} />
                <svelte:self options={option.options} />
            {:else if option instanceof ToogleAction}
                <label class="context-option" >
                    {option.name}
                    <input
                        type="checkbox"
                        name={option.name}
                        bind:checked={option.isSet}
                    />
                </label>
            {:else}
                <span>{option.name}</span>
            {/if}-->
    {/each}
</div>

<style lang="scss">
    #context-menu {
        user-select: none;
        font-size: 0.925em;
        max-width: 20ch;
        min-width: 13ch;
        position: fixed;
        display: none;
        box-sizing: border-box;
        padding-block: 0.1ch;
        border: 0.15ch solid var(--on-secondary);
        .context-option {
            padding-block: 0.1ch;
            padding-inline-start: 0.8ch;
            padding-inline-end: calc(1.2em + 0.8ch);
        }
        &[data-visible="true"] {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
        }
        background-color: var(--secondary-variant);
        color: var(--on-secondary);
        img,
        input {
            position: absolute;
            right: 0.4ch;
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
    }
</style>
