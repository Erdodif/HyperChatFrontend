<script>
    import { page } from "$app/stores";
    import { _ } from "svelte-i18n";
</script>

{#if $page.error}
    <h1>
        {$page.status}: {$_(`errors.${$page.error.message}`, {
            default: $_("errors.unspecific"),
        })}
    </h1>
{/if}
