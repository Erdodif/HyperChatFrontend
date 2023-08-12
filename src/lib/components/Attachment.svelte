<script lang="ts">
    import { page } from "$app/stores";
    import { PUBLIC_FILE_SERVER_URL } from "$env/static/public";
    import type Attachment from "$lib/classes/Attachment";
    import MimeImg from "./MimeImg.svelte";

    export let attachment: Attachment;

    const mimeSource = (mime: string) => {
        return `${$page.url.origin}/mimetypes/${mime.replaceAll("/", "-")}.svg`;
    };
</script>

<div class="attachment">
    {#if attachment.contentType && attachment.contentType.split("/")[0] === "image"}
        <a
            href={`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`}
            target="_blank"
        >
            <img
                src={`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`}
                alt={`${attachment.message.id}_${attachment.id}_${attachment.filename}`}
            /></a
        >
    {:else}
        <MimeImg mime={attachment.contentType} />
        <a
            class="file"
            href={`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`}
            target="_blank">{attachment.filename}</a
        >
    {/if}
</div>

<style lang="scss">
    .attachment {
        width: fit-content;
        margin-block: 0.5ch;
        border-radius: 0.5ch;
        display: grid;
        grid-template-rows: 1fr min-content;
        align-items: center;
        justify-content: center;
        img {
            max-width: 24em;
            max-height: 24em;
            border-radius: 0.5ch;
        }
        .file {
            background-color: var(--surface);
            border: 0.025em solid var(--on-surface);
            margin-block: auto;
            display: block;
            @include button(
                $background-color: var(--surface),
                $color: var(--on-background),
                $border-color: var(--on-surface),
                $shadow-color: var(--background)
            );
        }
    }
</style>
