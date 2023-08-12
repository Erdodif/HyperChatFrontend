<script lang="ts">
    import { page } from "$app/stores";

    export let mime: string = "unknown";

    const mimeSource = `${$page.url.origin}/mimetypes/${mime.replaceAll(
        "/",
        "-"
    )}.svg`;
</script>

<img
    class="mime"
    src={mimeSource}
    alt={mime}
    on:error={() => (this.src = `${$page.url.origin}/mimetypes/unknown.svg`)}
/>

<style lang="scss">
    .mime{
        margin-inline: auto;
        max-width: 5em;
        max-height: 5em;
    }
</style>
