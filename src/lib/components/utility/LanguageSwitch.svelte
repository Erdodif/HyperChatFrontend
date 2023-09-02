<script lang="ts">
    import { _, locale, locales } from "svelte-i18n";

    const getflag = (locale: string) => {
        if(locale == "en_US") locale = "us";
        return String.fromCodePoint(127397 + locale.toUpperCase().charCodeAt(0), 127397 + locale.toUpperCase().charCodeAt(1));
    };
</script>

<select bind:value={$locale}>
    {#each $locales as locale}
        <option value={locale}
            >{locale} - {$_(`languages.${locale}`)} - {getflag(locale)}</option
        >
    {/each}
</select>

<style lang="scss">
    select {
        background-color: var(--secondary-variant);
        color: var(--on-background);
        option:hover,
        option:focus {
            background-color: var(--secondary);
            color: var(--on-secondary);
        }
        border-radius: 0.725em;
    }
</style>
