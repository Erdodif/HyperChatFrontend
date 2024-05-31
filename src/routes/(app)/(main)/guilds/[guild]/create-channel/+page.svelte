<script lang="ts">
    import Rest from "$classes/Rest";
    import { goto } from "$app/navigation";
    // Stores
    import {page} from "$app/stores";
    import { guildSet } from "$stores/guildSet";
    let name: string = "";

    let guild = $guildSet.get($page.params.guild);

    const handleSubmit = async () => {
        const response = await Rest.sendToServer(`guilds/${guild.id}/channels`,{type:"GUILD_TEXT",name:name});
        let res = await response.json();
        if(response.ok){
            return await goto(`/channels/${res.id}`);
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
