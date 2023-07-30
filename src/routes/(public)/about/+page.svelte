<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import { _ } from "svelte-i18n";
    import PoweredByGiphy from "$lib/assets/Giphy/Poweredby_100px_Badge.gif";
</script>

<header>
    <Navigation />
</header>
<main>
    <h1>
        {$_("about.header")}
    </h1>
    <p>
        {$_("about.disclaimer.credits")}
    </p>
    <hr />
    <h2>
        {$_("about.repo.header")}
    </h2>
    <p>
        {$_("about.repo.frontend")}
    </p>
    <p>
        <a href="https://github.com/Erdodif/HyperChatFrontend"
            >Erdodif/HyperChatFrontend</a
        >
    </p>
    <p>
        {$_("about.repo.backend")}
    </p>
    <p>
        <a href="https://github.com/hypergonial/chat">hypergonial/chat</a>
    </p>
    <hr />
    <h2>
        {$_("about.devs.header")}
    </h2>
    <p>
        {$_("about.devs.all")}
    </p>
    <hr />
    <h2>{$_("about.technologies")}</h2>
    <p>
        {$_("about.giphy.soon")} <a href="https://giphy.com/">GIPHY</a>
    </p>
    <p>
        {$_("about.giphy.disclaimer")}
    </p>
    <img src={PoweredByGiphy} alt="Powered by Giphy">
</main>

<style lang="scss">
    :global(:root) {
        color: var(--on-background);
        background-color: var(--background);
    }
    main {
        margin-block-start: 3ch;
        width: min(90ch, 100%);
        padding-inline: 5ch;
        padding-block: 0.5em;
        box-sizing: border-box;
        background-color: var(--surface);
        margin-inline: auto;
        a {
            color: var(--secondary-variant);
            &:visited {
                color: var(--primary);
            }
            &:hover {
                color: var(--secondary);
            }
        }
    }
</style>
