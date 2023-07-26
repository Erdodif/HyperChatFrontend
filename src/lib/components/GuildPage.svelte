<script lang="ts">
    import type Guild from "$lib/classes/Guild";
    import Channels from "./Channels.svelte";
    import ArrowLeft from "$lib/assets/icons/arrow-left.svg";
    import ArrowRight from "$lib/assets/icons/arrow-right.svg";

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
        <details>
            <h1>{guild.name}</h1>

            <h2>Members</h2>

            <div>
                {#each guild.memberList as user, index}
                    <div>
                        <span>#{index + 1}</span>
                        <span>{user.displayName}</span>
                    </div>
                {/each}
            </div>

            <h2>Channels</h2>

            <div>
                {#each guild.channelList as channel}
                    <div>
                        <a href="/channels/{channel.name}">
                            {channel.name}
                        </a>
                    </div>
                {/each}
            </div>
        </details>
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
        z-index: 999;
        align-self: baseline;
    }
    section {
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
