<script lang="ts">
    import ButtonAction, { ContextMenuItem, Expandable, LinkAction, ToogleAction } from "$lib/classes/ContextMenuOption";
    import ContextMenu from "$lib/components/utility/ContextMenu.svelte";
    import clay from "$lib/assets/chat_bubble_clay.png";

    let contextMenu:ContextMenu;

    let name: string = "";
    let options = [
        new LinkAction("Log off","/login"),
        new ButtonAction("Say Hi",()=>alert("Hi")),
        new ContextMenuItem("Disabled text"),
        new ToogleAction("Can be set","category1",false),
        new Expandable("More options...",
            [
                new LinkAction("Log off","/login"),
                new ButtonAction("Say Hi",()=>alert("Hi")),
                new ContextMenuItem("Disabled text"),
                new ToogleAction("Can be set too","category1",false)
            ]
        )
    ];

    const handleSubmit = async () => {};
</script>

<form
    on:submit|preventDefault={handleSubmit}
    on:contextmenu|preventDefault={contextMenu.openAtCursor}
>
    <ContextMenu {options} bind:this={contextMenu} />
    <input type="text" bind:value={name} placeholder="Channel Name" />
    <span>{name}</span>
    <button type="submit">Create</button>
</form>

<style lang="scss">
    form{
        width:100%;
        height: 100%;
    }
</style>
