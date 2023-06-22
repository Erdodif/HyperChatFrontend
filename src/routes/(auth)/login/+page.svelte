<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import { token } from "$lib/stores/auth";
    import { page } from "$app/stores";
    export let username: string = "";
    export let password: string = "";
    let error: String = "";

    let from = "/";

    if (
        $page.url.searchParams.get("from") &&
        /^[^\@]+$/.test($page.url.searchParams.get("from"))
    ) {
        from = $page.url.searchParams.get("from");
    }

    onMount(() => {
        if (localStorage.getItem("username")) {
            username = localStorage.getItem("username");
        }
    });

    const handleSubmit = async () => {
        const response = await fetch(PUBLIC_SERVER_URL + "/users/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        if (response.status === 401) {
            error = "Invalid username or password";
            return;
        }
        const content = await response.json();
        if (response.ok) {
            if (content.token) {
                localStorage.setItem("auth-token", content.token);
                token.set(content.token);
                return goto(from);
            } else {
                console.error(content);
            }
        }
    };
</script>

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
        {#if error !== ""}
            <span class="error">
                {error}
            </span>
        {/if}
    </div>
    <button type="submit"> Login </button>
    <p>
        Don't have an account? How about <a href="/signup">Sign up</a>
    </p>
</form>

<style lang="scss">
    input,
    label {
        display: block;
    }
    form {
        box-sizing: border-box;
        max-width: 100%;
        width: min(15em, 100%);
        div {
            padding-block: 0.725em;
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
        gap: 1em;
        margin-inline: auto;
        margin-block: auto;
        filter: drop-shadow(0em 0em 0.075em var(--secondary));
        transition: filter 450ms ease-in-out;
        &:focus-within,
        &:hover {
            filter: drop-shadow(0em 0em 10em var(--secondary));
        }
        .error {
            font-size: 0.675em;
            color: var(--error);
        }
        p {
            align-self: center;
            font-size: 0.825em;
            max-width: min(25ch, 80%);
        }
    }
</style>
