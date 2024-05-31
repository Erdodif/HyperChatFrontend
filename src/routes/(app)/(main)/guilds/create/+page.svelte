<script lang="ts">
    import { goto } from "$app/navigation";
    import Rest, { RestMethod } from "$classes/Rest";
    let name: string = "";
    let id :string = "";

    const createGuild = async () => {
        const response = await Rest.sendToServer("guilds",{name:name});
        let res = await response.json();
        if(response.ok){
            return await goto(`/guilds/${res.id}`);
        }
    };

    const joinGuild = async () => {
        const response = await Rest.getFromServer(`guilds/${id}/members`,RestMethod.POST);
        if(response.ok){
            let res = await response.json();
            console.log(res);
            return await goto(`/guilds/${res.id}`);
        }
        console.log(response);
    };
</script>

<form on:submit|preventDefault={createGuild}>
    <h1>Create new Guild</h1>
    <input type="text" bind:value={name} placeholder="Guild Name" />
    <button type="submit">Create</button>
</form>
<form on:submit|preventDefault={joinGuild}>
    <h1>Or join by Id</h1>
    <input type="text" bind:value={id} placeholder="Guild Id" />
    <button type="submit">Join</button>
</form>

<style lang="scss">
    form {
        width: 100%;
        margin-block-end:2em;
    }
    h1{
        font-size:1.5em;
    }
</style>
