<script lang="ts">
    import { page } from "$app/stores";
    import userPreferences from "$lib/stores/userPreferences";
    import { writable } from "svelte/store";

    export let mime: string = "unknown";

    let mimeSource = writable()

    $mimeSource = `${$page.url.origin}/mimetypes/${mime.replaceAll(
        "/",
        "-"
    )}.svg`;
</script>

<img
    class="mime"
    src={$mimeSource}
    alt={mime}
    on:error={() => ($mimeSource = `${$page.url.origin}/mimetypes/unknown.svg`)}
    data-layout={$userPreferences.styleLayout}
/>

<style lang="scss">
    .mime {
        margin-inline: auto;
        &[data-layout="comfy"] {
            max-width: 8em;
            max-height: 8em;
        }
        &[data-layout="normal"] {
            max-width: 5em;
            max-height: 5em;
        }
        &[data-layout="compact"] {
            max-width: 4em;
            max-height: 4em;
        }
    }
</style>
