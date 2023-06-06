<script lang="ts">
    import clay from "$lib/assets/chat_bubble_clay.png"
    import blue from "$lib/assets/chat_bubble_blue.png"
    import purple from "$lib/assets/chat_bubble_purple.png"
    import gold from "$lib/assets/chat_bubble_gold.png"

    import { guilds } from "$lib/stores/guilds";

    console.log($guilds);

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
</script>

<!--{#each $guilds.values() as guild}
    <div class="guild" id={guild.id}>
        <img src={randomImage()} alt={guild.name}>
        <span class="name">
            {guild.name}
        </span>
    </div>
{/each}-->


<style lang="scss">
    .guild{
        img{
            max-height: 2em;
            max-width: 2em;
            width: 2em;
            height: auto;
        }
        .name{
            display: none;
        }
        &:hover{
            filter: drop-shadow(1em 1em 1em var(--secondary));           
            .name{
                display: block;
                position: absolute;
                left:0;
                bottom:-1em;
                font-size: .675em;
                background: var(--secondary-variant);
                color: var(--on-secondary);
            }
        }
    }
</style>
