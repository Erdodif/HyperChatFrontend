<script lang="ts">
    import { _, locale, locales } from "svelte-i18n";
    import type { ChangeEventHandler } from "svelte/elements";

    export let presetLocale:string;
    
    const getflag = (locale: string) => {
        if(locale === "en-US") {
            locale = "us";            
        }
        return String.fromCodePoint(
            127397 + locale.toUpperCase().charCodeAt(0), 
            127397 + locale.toUpperCase().charCodeAt(1)
        );
    };

    const isPresetPresent = () => {
        for (const locale of $locales){
            if(locale.replace(/[-.]/,'_') == presetLocale.replace(/[-.]/,'_')) return true;
        }
        return false;
    }

    const onChange: ChangeEventHandler<HTMLSelectElement> = (event: Event) => {
        $locale = (event.target! as HTMLSelectElement).value.replace(/[_.]/,'-');
    }

</script>

<select bind:value={presetLocale} on:change={onChange}>
    {#each $locales as locale}
        <option value={locale.replace(/[-.]/,'_')}>
            {locale} - {$_(`languages.${locale}`)} - {getflag(locale)}
        </option>
    {/each}
    {#if !isPresetPresent()}
    <option value={presetLocale.replace(/[-.]/,'_')}>
        {presetLocale} - {$_("errors.language-set-missing")} {$_("errors.language-unsupported")}
    </option>
    {/if}
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
