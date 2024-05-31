<script lang="ts">
	import { PUBLIC_FILE_SERVER_URL } from '$env/static/public';
	import Rest, { RestMethod } from '$classes/Rest';
	import { onMount } from 'svelte';
	import ContextMenu from '$components/utility/ContextMenu.svelte';
	import UserIcon from '$icons/chat/archetype/user.svelte';
    import User from '$classes/User';
    import ButtonAction, {
        ContextMenuItem,
        Expandable,
        LinkAction,
        ToogleAction,
    } from "$classes/ContextMenuOption";
    import { writable } from "svelte/store";

    export let options: ContextMenuItem[] = [];
    export let user: User;
    export let className:string = "";

    const getOptions = () =>[
            new ContextMenuItem(user.displayName),
            new ContextMenuItem(`(${user.username})`),
            new ContextMenuItem(`(${user.avatarHash})`),
        ...options];

    let valid = writable(false);
    let open = writable(false);

    const getSrc = () =>`${PUBLIC_FILE_SERVER_URL}/${user.avatarPath}`

    onMount(async () => {
        if(user.avatarHash === null){
            $valid = false;
            return;
        }
        let response = await Rest.sendToServer(user.avatarPath, null, RestMethod.OPTIONS, PUBLIC_FILE_SERVER_URL);
        if(response.ok){
            $valid = true;
        }
        // TODO - Validate user avatar url
    });
</script>

<button class={`${className} image-holder`} on:contextmenu|preventDefault={() => {$open = true}}>
    {#if user}
        <ContextMenu options={getOptions()} visible={$open} on:close={() => $open = false}/>
    {/if}
    {#if $valid}
        <img class={className} src={getSrc()} alt={user.displayName}>
    {:else}
        <UserIcon class={`userIcon`}/>
    {/if}
</button>

<style lang="scss">
    .image-holder{
        all:unset;
        width: 100%;
        height: 100%;
        img, :global(.userIcon){
            z-index:0;
            width: 100%;
            height: 100%;
            aspect-ratio: 1 / 1;
        }
        img{
            @include avatar_mask();
        }
    }
</style>
