<script lang="ts">
    import {onMount} from "svelte";
    import ColorPicker from "./ColorPicker.svelte";
    let primary = '#bb86fc';
    let primaryVariant = '#3700b3';
    let onPrimary = '#000000';
    let secondary = '#03dac6';
    let secondaryVariant = '#018786';
    let onSecondary = '#000000';
    let error = '#cf6679';
    let onError = '#000000';
    let background = '#121212';
    let onBackground = '#ffffff';
    let surface = '#161616';
    let onSurface = '#ffffff';
    let custom = true;

    onMount(() =>{
        custom = false;
    });
</script>

<velte:document style=""/>

<div>
    <button on:click="{() => custom = !custom}">
        Use Custom palette
    </button>
    {#if custom}
        <ColorPicker key="primary" label="Primary" value="{primary}"/>
        <ColorPicker key="primary-variant" label="Primary Variant" value="{primaryVariant}"/>
        <ColorPicker key="on-primary" label="On Primary" value="{onPrimary}"/>
        <ColorPicker key="secondary" label="Secondary" value="{secondary}"/>
        <ColorPicker key="secondary-variant" label="Secondary Variant" value="{secondaryVariant}"/>
        <ColorPicker key="on-secondary" label="On Secondary" value="{onSecondary}"/>
        <ColorPicker key="error" label="Error" value="{error}"/>
        <ColorPicker key="on-error" label="On Error" value="{onError}"/>
        <ColorPicker key="background" label="Background" value="{background}"/>
        <ColorPicker key="on-background" label="On Background" value="{onBackground}"/>
        <ColorPicker key="surface" label="Surface" value="{surface}"/>
        <ColorPicker key="on-surface" label="On Surface" value="{onSurface}"/>
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