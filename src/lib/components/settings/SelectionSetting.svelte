<script lang="ts">
    import type { SelectionSetting } from "$lib/classes/Settings";
    import { _ } from "svelte-i18n";

    export let setting: SelectionSetting;
</script>

<div class="setting__selection">
    <div>
        <h3>
            {$_(`${setting.localeKey}.name`)}
        </h3>
        <select bind:value={setting.current}>
            {#each setting.options as option}
                <option value={option}>
                    {$_(`${option}.name`)}
                </option>
            {/each}
        </select>
        <p class="current-description">
            {$_(`${setting.current}.description`)}
        </p>
    </div>
    <hr />
    <p>
        {$_(`${setting.localeKey}.description`)}
    </p>
</div>

<style lang="scss">
    .setting__selection{
        margin-inline:auto;
    }
    .current-description{
        font-size: .825em;
    }
</style>
