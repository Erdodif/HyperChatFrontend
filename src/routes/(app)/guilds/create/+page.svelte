<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { token } from "$lib/stores/auth";
    let name: string = "";

    const handleSubmit = async () => {
        const response = await fetch(PUBLIC_SERVER_URL + "/guilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": $token
            },
            body: JSON.stringify({name:name}),
        });
        console.log(await response.json());
        console.log(response);
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
