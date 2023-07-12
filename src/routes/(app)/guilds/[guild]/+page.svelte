<script lang="ts">
    import { page } from "$app/stores";
    import type Guild from "$lib/classes/Guild";
    import GuildPage from "$lib/components/GuildPage.svelte";

    let guild: Guild;
    $: guild = $page.data.guild;
</script>

<GuildPage {guild} />
