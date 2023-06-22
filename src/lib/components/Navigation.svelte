<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let ápage: "LOGIN" | "REGISTER" | "IN" | "WELCOME" = "LOGIN";
</script>

<nav>
    <span> Chat app lmao </span>
    <a href="/"> Home </a>
    <a href="/login"> Login </a>
    <button
        on:click={() => {
            localStorage.removeItem("user_name");
            localStorage.removeItem("display_name");
            localStorage.removeItem("user_id");
            localStorage.removeItem("auth-token");
            goto(`/login?from=${$page.url.href}`,{replaceState:true});
        }}>Logoff</button
    >
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
