<script lang="ts">
    import Application from "$lib/components/Application.svelte";
    import { _ } from "svelte-i18n";
</script>

<div>{$_("home.title")}</div>

<Application />
