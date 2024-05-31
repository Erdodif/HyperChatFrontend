<script lang="ts">
	import Rest, { RestMethod } from '$classes/Rest';
	import { user } from '$stores/auth';
	import ImageCropper from '$components/utility/ImageCropper.svelte';
	import { writable, derived } from 'svelte/store';
	import ChatPreview from "$components/preview/chat.svelte";

	let src= writable(null);


    const Save = async (imgSource)=>{
		$src = imgSource.detail.src;
		let response = await Rest.sendToServer("users/@me", {avatar:$src}, RestMethod.PATCH);
		if(response.ok){
			alert("success");
		}
		else{
			alert("error");
		}
	}

	let avatarEdit = writable(false);
	let file = writable(null);
	let fileInput;
</script>

{#if $user}
<div>
	<div>
		{$user.username}
	</div>
	<div>
		{$user.avatarHash}
	</div>
	<button on:click={()=>$avatarEdit=!$avatarEdit}>
		Edit avatar - TODO
	</button>
	{#if $avatarEdit}
		{#if $file}
			<button on:click={()=>$file=null}>X</button>
			<ImageCropper 
				src={$file}
				on:save={Save}
			/>
		{:else}
			<input bind:this={fileInput} type="file" accept=".png, .jpg, .jpeg, .webp" on:change={()=>$file = URL.createObjectURL(fileInput.files[0])}/>
		{/if}
		{#if $src !== null}
			<ChatPreview src={$src} />
		{/if}
	{/if}
</div>
{/if}
