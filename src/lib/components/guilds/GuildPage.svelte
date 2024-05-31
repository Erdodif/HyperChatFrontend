<script lang="ts">
    import type Guild from "$classes/Guild";
    import Channels from "$components/Channels.svelte";
    import ArrowLeft from "$icons/arrow-left.svelte";
    import ArrowRight from "$icons/arrow-right.svelte";
    import { _ } from "svelte-i18n";

    export let guild: Guild;
    let image = ArrowLeft;
    let collapsed = false;
    let template = "15ch 2ch 1fr";

    const toogle = () => {
        collapsed = !collapsed;
        if (collapsed) {
            image = ArrowRight;
            template = "0ch 2ch 1fr";
            return;
        }
        image = ArrowLeft;
        template = "15ch 2ch 1fr";
    };
</script>

<section style={`--columns: ${template}`}>
    <div class="sidebar" style={collapsed ? "visibility:hidden;" : ""}>
        <span>
            {guild.name}
        </span>
        <hr />
        <Channels {guild} />
    </div>
    <button
        class="collapse"
        style={`background-image: url(${image});`}
        on:click={toogle}
    />
    <div class="guild">
        <slot />
    </div>
</section>

<style lang="scss">
    .collapse {
        //position: absolute;
        right: 0;
        margin-inline-start:-.5em;
        margin-block-start:1em;
        width: .5em;
        height: 1.5em;
        background-size: contain;
        z-index: 10;
        align-self: baseline;
    }
    section {
        height: 100%;
        position: relative;
        display: grid;
        justify-content: start;
        grid-template-columns: var(--columns);
    }
    span {
        max-width: 100%;
        word-wrap: break-word;
    }
</style>
