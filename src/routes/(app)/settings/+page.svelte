<script lang="ts">
    import Rest, { RestMethod } from "$lib/classes/Rest";
    import GuildPage from "$lib/components/GuildPage.svelte";
    import BooleanSetting from "$lib/components/settings/BooleanSetting.svelte";
    import ConstrainedTextSetting from "$lib/components/settings/ConstrainedTextSetting.svelte";
    import NumericSetting from "$lib/components/settings/NumericSetting.svelte";
    import SelectionSetting from "$lib/components/settings/SelectionSetting.svelte";
    import LanguageSwitch from "$lib/components/utility/LanguageSwitch.svelte";
    import userPreferences, {
        UserPreferences,
    } from "$lib/stores/userPreferences";
    import { _, isLoading } from "svelte-i18n";

    let settings: UserPreferences;
    userPreferences.subscribe((prefs) => (settings = prefs.copy()))();

    const handleSave = async (event) => {
        if (
            (
                await Rest.sendBigIntToServer(
                    "prefs",
                    settings.exportSettings(),
                    RestMethod.PATCH
                )
            ).ok
        ) {
            alert($_("settings.saved"))
            $userPreferences = settings
        }
    };
</script>

{#if $isLoading}
    <div>Loading</div>
{:else}
    <div class="settingpage">
        <form on:submit|preventDefault={handleSave}>
            <h1>
                {$_("settings.header")}
            </h1>
            <h2>
                {$_("settings.categories.locale")}
            </h2>
            <div class="settings settings__language">
                <LanguageSwitch />
            </div>
            <hr />
            <h2>
                {$_("settings.categories.ui")}
            </h2>
            <div class="settings settings__ui">
                <SelectionSetting bind:setting={settings.layout} />
                <NumericSetting bind:setting={settings.textSize} />
            </div>
            <hr />
            <h2>
                {$_("settings.categories.chat")}
            </h2>
            <div class="settings settings__chat">
                <NumericSetting
                    bind:setting={settings.messageGroupingTimeout}
                />
                <BooleanSetting bind:setting={settings.flags[0]} />
                <BooleanSetting bind:setting={settings.flags[1]} />
            </div>
            <input type="submit" value={$_("settings.save_changes")} />
        </form>
    </div>
{/if}

<style lang="scss">
    hr {
        width: 95%;
    }
    .settingpage {
        margin: 0;
        overflow: hidden;
        height: 100%;
        form {
            height: 100%;
            overflow-y: auto;
            max-width: 40rem;
            margin-inline: auto;
            padding-inline: 1em;
            padding-block-end: 2em;
            @include scrollbar;
            input[type="submit"] {
                @include button;
                margin-inline: auto;
                width: fit-content;
                margin-inline: auto;
                text-align: center;
            }
        }
        .settings {
            width: 80%;
            margin-inline: auto;
        }
    }
</style>
