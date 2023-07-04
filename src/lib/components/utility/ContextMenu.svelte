<script lang="ts">
    import ContextAction, {
        ContextMenuItem,
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

    export const open = (event: MouseEvent) => {
        node.setAttribute("data-visible", "true");
        node.style.top = `0`;
        node.style.left = `0`;
        let x = event.clientX;
        let y = event.clientY;
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
    {#if !options.length}
        <span>No Actions available</span>
    {/if}
    {#each options as option}
        <div class="context-option">
            {#if option instanceof ContextAction}
                <button on:click={option.action} class="clickable"
                    >{option.name}</button
                >
            {:else if option instanceof LinkAction}
                <a href={option.href}>{option.name}</a>
            {:else if option instanceof ToogleAction}
                <label>
                    {option.name}
                    <input
                        type="checkbox"
                        name={option.name}
                        bind:checked={option.isSet}
                    />
                </label>
            {:else}
                <span>{option.name}</span>
            {/if}
            {#if option.icon}
                <img src={option.icon} alt={option.name} />
            {/if}
        </div>
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
        padding-block: 0.2ch;
        padding-inline: 0.8ch;
        &[data-visible="true"] {
            display: block;
        }
        background-color: var(--secondary-variant);
        color: var(--on-secondary);
    }
</style>
