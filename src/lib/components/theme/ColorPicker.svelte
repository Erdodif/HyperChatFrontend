<script lang="ts">
	import { onMount } from "svelte";
    import {onSurface} from "$lib/stores/theme";

	export let key;
	export let value;
	export let label;

	let set: (key: string, value: string) => void = (
		key: string,
		value: string
	) => {};

	onMount(() => {
		set = (key: string, value: string) => document.documentElement.style.setProperty(`--${key}`, value);
	});

	$: set(key, value);
</script>

<label>
	<input type="color" bind:value />
	{label}
</label>

<style lang="scss">
	input {
		padding: 0;
		background-color: transparent;
		border: transparent;
	}
</style>
