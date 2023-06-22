<script lang="ts">
    import clay from "$lib/assets/chat_bubble_clay.png";
    import blue from "$lib/assets/chat_bubble_blue.png";
    import purple from "$lib/assets/chat_bubble_purple.png";
    import gold from "$lib/assets/chat_bubble_gold.png";

    import { guilds } from "$lib/stores/guilds";

    const randomImage = () => {
        switch(Math.floor(Math.random() * 4)){
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

    console.log($guilds);

    $:()=>console.log($guilds);
</script>

{#each $guilds as guild}
    <a class="guild" id={guild.id} href="/guilds/{guild.id}">
        <img src={randomImage()} alt={guild.name}>
        <span class="name">
            {guild.name}
        </span>
    </a>
{/each}


<style lang="scss">
    .guild{
        user-select: none;
        img{
            max-height: 90%;
            max-width: 90%;
            width: auto;
            margin-inline: auto;
            margin-block:.175em;
        }
        .name{
            display: none;
        }
        &:hover{
            filter: drop-shadow(0em 0em .425em var(--primary));           
            .name{
                max-width: 20ch;
                width: max-content;
                display: block;
                position: absolute;
                left: 4em;
                bottom: 30%;
                font-size: .675em;
                background: var(--background);
                padding-inline:1ch;
                border-radius: 1ch;
                color: var(--on-background);
            }
        }
    }
</style>
