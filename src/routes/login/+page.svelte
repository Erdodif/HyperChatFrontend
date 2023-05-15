<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { onMount } from "svelte";
    export let username: string = "";
    export let password: string = "";

    onMount(()=>{
        if(localStorage.getItem("username")){
            username = localStorage.getItem("username");
        }
    });

    const handleSubmit = async () => {
        const response = await fetch(PUBLIC_SERVER_URL + "/user/auth", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        const content: {username:Number,token:string} = await response.json();
        if(content.token){
            localStorage.setItem("auth-token",content.token);
            throw goto('/');
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
        <button type="submit"> Login </button>
        <p>
            Don't have an account?
            <br/>How about <a href="/signup"
                >Sign the hell up</a
            >
        </p>
    </form>
</div>

<style lang="scss">
    input,label{
        display: block;
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
