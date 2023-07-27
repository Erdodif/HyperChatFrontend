<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { user } from "$lib/stores/auth";
    import { guildSet } from "$lib/stores/guildSet";
    import LanguageSwitch from "./utility/LanguageSwitch.svelte";
</script>

<nav>
    <span>{$_('title.index')}</span>
    <a href="/"> {$_('nav.home')} </a>
    {#if $user}
        <span>{$user.username} ({$_('user.aka')}: {$user.displayName})</span>
    {:else}
        <a data-sveltekit-replacestate href="/login"> Login </a>
    {/if}
    <button
        on:click={() => {
            localStorage.removeItem("user_name");
            localStorage.removeItem("display_name");
            localStorage.removeItem("user_id");
            localStorage.removeItem("auth-token");
            guildSet.resetGuildSet();
            goto(`/login?from=${$page.url.href}`, { replaceState: true });
        }}>Logoff</button
    >
    <LanguageSwitch/>
</nav>

<style lang="scss">
    nav {
        background: var(--surface);
        padding: 0.2em;
        border-bottom: 0.125em solid var(--secondary-variant);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
        align-items: space-between;
        a,
        span {
            text-decoration: none;
            color: var(--on-surface);
            border-radius: 0.2em;
            padding: 0.155em;
        }
        a:hover {
            color: var(--on-background);
            filter: drop-shadow(0 0 1em var(--background));
        }
    }
</style>
