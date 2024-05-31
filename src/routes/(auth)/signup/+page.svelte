<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import Rest from "$classes/Rest";
    export let username: string = "";
    export let password: string = "";
    export let password2: string = "";

    const handleSubmit = async () => {
        if (password !== password2) return;
        const response = await Rest.sendToServer("users", {
            username: username,
            password: password,
        });
        const content = await response.json();
        if (content.username) {
            localStorage.setItem("username", username);
            await goto("/login");
        } else {
            console.error(content);
        }
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
    </div>
    <div>
        <label for="password">{$_("auth.password-again")} </label>
        <input
            type="password"
            id="password2"
            bind:value={password2}
            placeholder={$_("auth.password")} 
            autocomplete="current-password"
        />
        {#if password !== password2}
            <span class="error"> {$_("errors.auth.password-mismatch")}</span>
        {/if}
    </div>
    <button type="submit"> Sign up </button>
</form>

<style lang="scss">
    input,
    label {
        display: block;
    }
    span {
        font-size: 0.765em;
        height: 0.765em;
        display: block;
        min-width: 1em;
        &.error {
            color: var(--error);
        }
    }
    form {
        box-sizing: border-box;
        max-width: 100%;
        width: min(15em, 100%);
        div {
            padding-block-end: 0.725em;
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
            position: absolute;
            font-size: 0.675em;
            color: var(--error);
        }
    }
</style>
