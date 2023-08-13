<script lang="ts">
    import { goto } from "$app/navigation";
    import {page} from "$app/stores";
    import Rest from "$lib/classes/Rest";
    import { guildSet } from "$lib/stores/guildSet";
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
