<script lang="ts">
    import { goto } from "$app/navigation";
    import { token } from "$lib/stores/auth";
    import {page} from "$app/stores";
    import Rest from "$lib/classes/Rest";
    let name: string = "";

    const handleSubmit = async () => {
        const response = await Rest.sendToServer(`/guilds/${$page.data.guild.id}/channels`,{name:name});
        let res = await response.json();
        if(response.ok){
            throw goto(`/channels/${res.id}`);
        }
        console.log(res);
    };
</script>

<form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={name} placeholder="Channel Name" />
    <span>{name}</span>
    <button type="submit">Create</button>
</form>

<style lang="scss">
    form {
        width: 100%;
        height: 100%;
    }
</style>
