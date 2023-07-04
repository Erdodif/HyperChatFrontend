<script lang="ts">
    import clay from "$lib/assets/chat_bubble_clay.png";
    import blue from "$lib/assets/chat_bubble_blue.png";
    import purple from "$lib/assets/chat_bubble_purple.png";
    import gold from "$lib/assets/chat_bubble_gold.png";

    import { guilds } from "$lib/stores/guilds";

    const randomImage = () => {
        switch (Math.floor(Math.random() * 4)) {
            default:
                return clay;
            case 1:
                return blue;
            case 2:
                return purple;
            case 3:
                return gold;
        }
    };

    $: () => console.log($guilds);
</script>

<div class="guilds">
    {#each $guilds as guild}
        <a class="guild" id={guild.id} href="/guilds/{guild.id}">
            <img src={randomImage()} alt={guild.name} />
            <span class="name">
                {guild.name}
            </span>
        </a>
    {/each}
    <a href="/guilds/create" id="create">+</a>
</div>

<style lang="scss">
    .guilds {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        gap:.275em;
        #create {
            line-height: 1.625em;
            user-select: none;
            font-weight: bold;
            font-size: 1.5em;
            color: var(--background);
            background-color: var(--primary);
            border: 0.1ch solid var(--primary-variant);
            width: 80%;
            margin-inline:auto;
            aspect-ratio: 1 / 1;
            text-decoration: none;
            text-align: center;
            border-radius: 35%;
            &:hover{
                background-color: var(--primary-variant);
                border: 0.1ch solid var(--secondary-variant);
                color: var(--secondary);
                filter: drop-shadow(0em 0em 0.075em var(--secondary));
                transition: all 170ms ease-in-out;
            }
        }
        .guild {
            user-select: none;
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
                    font-size: 0.675em;
                    background: var(--background);
                    padding-inline: 1ch;
                    border-radius: 1ch;
                    color: var(--on-background);
                }
            }
        }
    }
</style>
