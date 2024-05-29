<script lang="ts">
    import Rest, { RestMethod } from "$lib/classes/Rest";
    // Components
    import GuildPage from "$lib/components/GuildPage.svelte";
    import BooleanSetting from "$lib/components/settings/BooleanSetting.svelte";
    import ConstrainedTextSetting from "$lib/components/settings/ConstrainedTextSetting.svelte";
    import NumericSetting from "$lib/components/settings/NumericSetting.svelte";
    import SelectionSetting from "$lib/components/settings/SelectionSetting.svelte";
    import LanguageSwitch from "$lib/components/utility/LanguageSwitch.svelte";
    // Utility
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    // Stores
    import { token } from "$lib/stores/auth";
    import { page } from "$app/stores";
    import userPreferences, {
        UserPreferences,
    } from "$lib/stores/userPreferences";
    // i18n
    import { _, isLoading } from "svelte-i18n";

    
    let settings: UserPreferences;
    userPreferences.subscribe((prefs) => {if(prefs) settings = prefs.copy()});

    const handleSave = async () => {
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
            $userPreferences = settings.copy();
            $userPreferences.applyStyleSettings();
        }
    };

    onMount(async () => {
        if (!(await Rest.isTokenValid("users/@self"))) {
            goto(`/login?from=${$page.url.pathname}`);
            return;
        }
        userPreferences.fromJson(
            (await Rest.getJsonBigint(
                "prefs",
                RestMethod.GET,
                "flags"
            )) as unknown as PreferenceJson,
            true
        );
    });

    const backNavigation = () => {
        let dirty = false;
        console.log(settings);
        console.log($userPreferences);
        let diff = $userPreferences.compare(settings);
        console.log(`Difference count: ${diff}`);
        if(diff !== 0){
            console.warn("Settings are dirty!");
            alert($_("errors.settings.dirty", {values:{changeCount:diff}}));
            return;
        }
        history.back();
    }

    $: {
        Rest.token = $token;
    }

</script>

<main>
    {#if $isLoading || !$userPreferences}
        <div>Loading</div>
    {:else}
        <div class="settingpage">
            <button class="back" on:click={backNavigation}>
                X
            </button>
            <form on:submit|preventDefault={handleSave}>
                <h1>
                    {$_("settings.header")}
                </h1>
                <h2>
                    {$_("settings.categories.locale")}
                </h2>
                <div class="settings settings__language">
                    <LanguageSwitch bind:presetLocale={settings.locale.value}/>
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
</main>

<style lang="scss">
    hr {
        width: 95%;
    }
    .back{
        position: fixed;
        right:1em;
        top:0.725em;
    }
    main{
        background-color: var(--background);
        color: var(--on-surface);
        overflow-y:auto;
        margin-inline:auto;
        .settingpage {
            font-size: 1rem;
            margin: 0;
            overflow: hidden;
            height: 100%;
            padding:0.525em;
            form {
                background-color: var(--surface);
                height: 100%;
                border-radius:1em;
                overflow-y: auto;
                max-width: 40rem;
                margin-inline:auto;
                padding-inline: 2rem;
                padding-block-end: 2rem;
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
    }
</style>
