<script lang="ts">
    //TODO - Localization
    import {onMount} from "svelte";
    import ColorPicker from "./ColorPicker.svelte";
    //import {theme} from "$stores/theme";
    import {themeFromStorage, theme, themeToStorage, onSurface} from "$lib/stores/theme";
    let custom = true;

    onMount(() =>{
        custom = false;
        themeFromStorage()
    });
</script>

<velte:document style=""/>

<div>
    <button on:click="{() => custom = !custom}">
        Use Custom palette
    </button>
    {#if custom}
        <ColorPicker key="primary" label="Primary" value="{$theme.primary}"/>
        <ColorPicker key="primary-variant" label="Primary Variant" value="{$theme.primaryVariant}"/>
        <ColorPicker key="on-primary" label="On Primary" value="{$theme.onPrimary}"/>
        <ColorPicker key="secondary" label="Secondary" value="{$theme.secondary}"/>
        <ColorPicker key="secondary-variant" label="Secondary Variant" value="{$theme.secondaryVariant}"/>
        <ColorPicker key="on-secondary" label="On Secondary" value="{$theme.onSecondary}"/>
        <ColorPicker key="error" label="Error" value="{$theme.error}"/>
        <ColorPicker key="on-error" label="On Error" value="{$theme.onError}"/>
        <ColorPicker key="background" label="Background" value="{$theme.background}"/>
        <ColorPicker key="on-background" label="On Background" value="{$theme.onBackground}"/>
        <ColorPicker key="surface" label="Surface" value="{$theme.surface}"/>
        <ColorPicker key="on-surface" label="On Surface" value="{$onSurface}"/>
        <button on:click="{() => themeToStorage($theme)}">
            Save as custom theme
        </button>
    {/if}
</div>

<style lang="scss">
    div{
        background: var(--surface);
        color:var(--on-surface);
        padding:.225em;
        display: flex;
        gap:.565em;
        flex-direction: column;
        flex-wrap: nowrap;
    }
</style>