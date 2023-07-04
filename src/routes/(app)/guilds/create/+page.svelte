<script lang="ts">
    import ContextAction, { ContextMenuItem, LinkAction, ToogleAction } from "$lib/classes/ContextMenuOption";
    import ContextMenu from "$lib/components/utility/ContextMenu.svelte";

    let contextMenu:ContextMenu;

    let name: string = "";
    let options = [
        new LinkAction("Log off",null,"/login"),
        new ContextAction("Say Hi",null,()=>alert("Hi")),
        new ContextMenuItem("Disabled text"),
        new ToogleAction("Can be set",null,false)
    ];

    const handleSubmit = async () => {};
</script>

<form
    on:submit|preventDefault={handleSubmit}
    on:contextmenu|preventDefault={contextMenu.open}
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
