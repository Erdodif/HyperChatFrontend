<script lang="ts">
    import { _, locale, locales } from "svelte-i18n";
</script>

<select bind:value={$locale}>
    {#each $locales as locale}
        <option value={locale}>{locale} - {$_(`languages.${locale}`)}</option>
    {/each}
</select>
