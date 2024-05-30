<script lang="ts">
    import Guilds from "$lib/components/guilds/Guilds.svelte";
    import { guildSet } from "$lib/stores/guildSet";
    import chat from "$lib/assets/icons/chat/bubble.svelte";

    let holderOpen = false;
</script>

{#if $guildSet.length == 0}
    <div>
        Looks like you don't have any guild, how about <a href="/guilds/create"
            >create a Guild</a
        >.
    </div>
{:else}
    <p>Guilds</p>
    <div
        id="guildholder"
        data-opened={holderOpen}
        style={`background-image: url("${gold}")`}
        on:click={() => (holderOpen = !holderOpen)}
        on:keypress={(e)=>{if(e.key === "\n") holderOpen = !holderOpen}}
    >
        {#each $guildSet.guildsArray as guild}
            <a class="guild" id={guild.id} href="/guilds/{guild.id}">
                <svg src={chat} alt={guild.name}/>
                <span class="name">
                    {guild.name}
                </span>
            </a>
        {/each}
    </div>
{/if}

<style lang="scss">
    #guildholder {
        user-select: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        padding-left: 6em;
        height: 6em;
        border-radius: 1.725em;
        background-repeat: no-repeat;
        background-size: contain;
        &[data-opened="false"] * {
            display: none;
        }
        &:hover{
            filter: drop-shadow(0em 0em 0.425em var(--primary));
        }
        &[data-opened="true"] .guild {
            counter-increment: guilds;
            width: 3em;
            height: 3em;
            img {
                max-height: 90%;
                max-width: 90%;
                width: auto;
                margin-inline: auto;
                margin-block: 0.175em;
            }
            .name {
                display: none;
            }
            &:hover {
                filter: drop-shadow(0em 0em 0.425em var(--primary));
                .name {
                    max-width: 20ch;
                    width: max-content;
                    display: block;
                    position: absolute;
                    left: 4em;
                    bottom: 30%;
                    font-size: 0.675rem;
                    background: var(--background);
                    padding-inline: 1ch;
                    border-radius: 1ch;
                    color: var(--on-background);
                }
            }
        }
    }
</style>
