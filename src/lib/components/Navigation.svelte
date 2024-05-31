<script lang="ts">
	import { LinkAction } from '$classes/ContextMenuOption.ts';
	import Avatar from '$components/chat/Avatar.svelte';
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { user } from "$stores/auth";
    import { guildSet } from "$stores/guildSet";
    import userPreferences from "$stores/userPreferences";
    import { PUBLIC_FILE_SERVER_URL } from "$env/static/public";

    const getOptions= ()=>[
        new LinkAction("Profile", "/users/@me"),
        new LinkAction("PFP", `${PUBLIC_FILE_SERVER_URL}/${$user.avatarPath}`,null, false, true)
    ];
</script>

<nav data-layout={$userPreferences ? $userPreferences.styleLayout : "normal"}>
    <a href="/"> {$_("title.index")} </a>
    {#if $user}
        <div on:click={()=>goto("/users/@me")} >
            <Avatar className="avatar" user={$user} options={getOptions()}/>
            <span>
                {$user.username} 
                {#if $user.display_name}
                ({$_("user.aka")}: {$user.displayName})
                {/if}
            </span>
        </div>
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
        align-items: center;
        div{
            height:2em;
            display:inline-flex;
            align-items:center;
            gap:1em;
        }
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
