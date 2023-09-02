<script lang="ts">
    import type { BooleanSetting } from "$lib/classes/Settings";
    import { _ } from "svelte-i18n";

    export let setting: BooleanSetting;
</script>

<div class="setting__boolean">
    <div>
        <input
            type="checkbox"
            name={setting.localeKey}
            id={setting.localeKey}
            bind:checked={setting.isSet}
        />
        <h3>
            {$_(`${setting.localeKey}.name`)}
        </h3>
    </div>
    <p>
        {$_(`${setting.localeKey}.description`)}
    </p>
</div>

<style>
    h3 {
        font-size: 1.2em;
    }
</style>
