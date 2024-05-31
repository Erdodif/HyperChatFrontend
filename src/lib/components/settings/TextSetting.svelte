<script lang="ts">
    import type { TextSetting } from "$classes/Settings";
    import { _ } from "svelte-i18n";

    export let setting: TextSetting;
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
    </div>
    <p>
        {$_(`${setting.localeKey}.description`)}
    </p>
</div>

<style lang="scss">
</style>
