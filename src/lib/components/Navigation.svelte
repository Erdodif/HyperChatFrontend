<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { user } from "$lib/stores/auth";
    import { guildSet } from "$lib/stores/guildSet";
    import userPreferences from "$lib/stores/userPreferences";
</script>

<nav data-layout={$userPreferences ? $userPreferences.styleLayout : "normal"}>
    <a href="/"> {$_("title.index")} </a>
    {#if $user}
        <span>
            {$user.username} 
            {#if $user.display_name}
            ({$_("user.aka")}: {$user.displayName})
            {/if}
        </span>
        <button
            on:click={() => {
                localStorage.removeItem("user_name");
                localStorage.removeItem("display_name");
                localStorage.removeItem("user_id");
                localStorage.removeItem("auth-token");
                guildSet.resetGuildSet();
                goto(`/login?from=${$page.url.href}`, { replaceState: true });
            }}>
            {$_("nav.logout")}
            </button
        >
    {:else}
        <a data-sveltekit-replacestate href="/login"> Login </a>
    {/if}
    <a href="/about">{$_("about.header")}</a>
</nav>

<style lang="scss">
    nav {
        background: var(--surface);
        border-bottom: 0.155rem solid var(--secondary-variant);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: space-between;
        a,
        span {
            text-decoration: none;
            color: var(--on-surface);
            border-radius: 0.2em;
        }
        a:hover {
            color: var(--secondary);
            filter: drop-shadow(0 0 1em var(--on-background));
        }
        &[data-layout="comfy"] {
            gap: 2.5rem;
            padding: .5rem;
            span {
                padding: 0.255rem;
            }
        }
        &[data-layout="normal"] {
            gap: 1rem;
            padding: 0.2rem;
            span {
                padding: 0.155rem;
            }
        }
        &[data-layout="compact"] {
            gap: .725rem;
            padding: 0.125rem;
            span {
                padding: 0.055rem;
            }
        }
    }
</style>
