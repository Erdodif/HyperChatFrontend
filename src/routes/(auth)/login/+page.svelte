<script lang="ts">
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { token } from "$stores/auth";
    import { page } from "$app/stores";
    import Rest from "$classes/Rest";
    import { guildSet } from "$stores/guildSet";
    export let username: string | null = "";
    export let password: string = "";
    let error: String = "";

    let from = new URL($page.url.searchParams.get("from") ?? "",$page.url);

    if($page.url.searchParams.get("from") === null || from.hostname !== $page.url.hostname){
        from = new URL("/",$page.url);
    } 
    
    onMount(() => {
        if (localStorage.getItem("username")) {
            username = localStorage.getItem("username");
        }
    });

    const handleSubmit = async () => {
        const response = await Rest.sendToServer("users/auth", {
            username: username,
            password: password,
        });
        if (response.status === 401) {
            error = $_("errors.auth.credentials");
            return;
        }
        const content = await response.json();
        if (response.ok && content.token) {
            localStorage.setItem("auth-token", content.token);
            guildSet.resetGuildSet();
            token.set(content.token);
            return await goto(from);
        }
        console.error(content);
    };
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="username"> {$_("auth.username")} </label>
        <input
            type="text"
            id="username"
            bind:value={username}
            placeholder={$_("auth.username")}
            autocomplete="username"
        />
    </div>
    <div>
        <label for="password"> {$_("auth.password")} </label>
        <input
            type="password"
            id="password"
            bind:value={password}
            placeholder={$_("auth.password")}
            autocomplete="current-password"
        />
        {#if error !== ""}
            <span class="error">
                {error}
            </span>
        {/if}
    </div>
    <button type="submit"> {$_("auth.login")} </button>
    <p>
        {$_("auth.no-account")}<a href="/signup">{$_("auth.signup")}</a>
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
        width: min(16em, 100%);
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
        a {
            color: var(--secondary-variant);
            &:hover,
            &:focus,
            &:focus-visible {
                color: var(--secondary);
            }
        }
    }
</style>
