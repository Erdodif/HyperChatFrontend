<script lang="ts">
	import { onMount } from "svelte";

	export let key: string;
	export let value: string;
	export let label: string;

	let set: (key: string, value: string) => void = () => {};

	onMount(() => {
		set = (key: string, value: string) =>
			document.documentElement.style.setProperty(`--${key}`, value);
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
