<script>
	import * as themeManager from '../../ThemeManager';

	export let key;
	export let value;
	export let label;
	
	$: themeManager.set(key, value);
</script>

<label>
	<input style="padding:0" type="color" bind:value/> 
	{label}
</label>

<style lang="scss">
    input{
        padding:0;
        background-color: transparent;
        border:transparent;
    }
</style>
