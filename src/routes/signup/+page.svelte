<script lang="ts">
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { goto } from '$app/navigation';
    export let username: string = "";
    export let password: string = "";
    export let password2: string = "";

    const handleSubmit = async () => {
        if (password !== password2) return;
        const response = await fetch(PUBLIC_SERVER_URL + "/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username":username,
                "password":password,
            }),
        });
        const content = await response.json();
        if(content.username){
            localStorage.setItem("username",username);
            goto('/login');
        }
        else{
            console.error(content);
        }
    };
</script>

<div class="holder">
    <form on:submit|preventDefault={handleSubmit}>
        <div>
            <label for="username"> Username </label>
            <input
                type="text"
                id="username"
                bind:value={username}
                autocomplete="username"
            />
        </div>
        <div>
            <label for="password"> Password </label>
            <input
                type="password"
                id="password"
                bind:value={password}
                placeholder="password"
                autocomplete="current-password"
            />
        </div>
        <div>
            <label for="password"> Password again </label>
            <input
                type="password"
                id="password2"
                bind:value={password2}
                placeholder="password again"
                autocomplete="current-password"
            />
            {#if password !== password2}
                <span class="error">
                    The two password must match!
                </span>
            {:else}
                <span />
            {/if}
        </div>
        <button type="submit"> Sign up </button>
    </form>
</div>

<style lang="scss">
    input,label{
        display: block;
    }
    span{
        font-size: .765em;
        height: .765em;
        display: block;
        min-width: 1em;
        &.error{
            color:var(--error);
        }
    }
    .holder {
        background-color: var(--background);
        @supports (height: 100dvh) {
            min-height: 100dvh;
        }
        min-height: 100vh;
        display: grid;
        align-items: center;
        justify-content: center;
        form {
            width: fit-content;
            div {
                display: block;
                margin-inline: auto;
            }
            background-color: var(--surface);
            padding: 2em;
            border-radius: 1em;
            display: flex;
            color: var(--primary);
            flex-direction: column;
            flex-wrap: nowrap;
            gap: 2em;
            margin-inline: auto;
            margin-block: auto;
            filter: drop-shadow(0em 0em .075em var(--secondary));
            transition: filter 450ms ease-in-out;
            &:focus-within, &:hover{
                filter: drop-shadow(0em 0em 10em var(--secondary));
            }
        }
    }
</style>
