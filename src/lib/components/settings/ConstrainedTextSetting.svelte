<script lang="ts">
    import type { ConstrainedTextSetting } from "$lib/classes/Settings";
    import { _ } from "svelte-i18n";

    export let setting: ConstrainedTextSetting;
</script>

<div class="setting__numeric">
    <div>
        <h3>
            {$_(`${setting.localeKey}.name`)}
        </h3>
        <input
            type="text"
            name={setting.localeKey}
            id={setting.localeKey}
            bind:value={setting.value}
        />
        {#if !setting.valueIsvalid}
            <span class="error">
                {$_("errors.text.format_invalid")}
            </span>
        {/if}
    </div>
    <p>
        {$_(`${setting.localeKey}.description`)}
    </p>
    <p>
        {$_("setting.constrained_text.example")}
    </p>
    <p>
        {$_(`${setting.localeKey}.example`)}
    </p>
</div>

<style lang="scss">
</style>
