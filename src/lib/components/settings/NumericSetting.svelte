<script lang="ts">
    import type { NumericSetting } from "$classes/Settings";
    import { _, isLoading, number } from "svelte-i18n";

    export let setting: NumericSetting;
</script>

<div class="setting__numeric">
    <div>
        <h3>
            {$_(`${setting.localeKey}.name`)}
        </h3>
        <input
            type="number"
            name={setting.localeKey}
            id={setting.localeKey}
            min={setting.min}
            max={setting.max}
            bind:value={setting.value}
        />
    </div>
    {#if !setting.isInBounds}
        <span class="error">
            {$_("errors.setting.numeric.out_of_bounds", {
                values: {
                    min: $number(setting.min),
                    max: $number(setting.max),
                },
            })}
        </span>
    {/if}
    <p>
        {$_(`${setting.localeKey}.description`)}
    </p>
</div>

<style lang="scss">
</style>
