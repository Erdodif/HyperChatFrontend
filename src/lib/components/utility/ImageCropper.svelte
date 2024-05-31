<script lang="ts">
    // TODO - icons, locale, image processing, final design

	import { createEventDispatcher } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
    import { _ } from "svelte-i18n";

    export let src: string | URL;
    const dispatch = createEventDispatcher();

    let modifiedSource = writable("");

    // Initial Info

    let imageObject= writable(document.createElement('span'));

    let left = writable(0);
    let top = writable(0);
    let initialWidth = writable(100);
    let initialHeight = writable(100);
    let scale = writable(1);
    let width = derived([initialWidth, scale], ([$initialWidth,$scale])=>{return $initialWidth * $scale});
    let height = derived([initialHeight, scale], ([$initialHeight,$scale])=>{return $initialHeight * $scale});

    let scrollWidth = derived(imageObject, ($imageObject) => $imageObject.scrollWidth);
    let scrollHeight = derived(imageObject, ($imageObject) => $imageObject.scrollHeight);
    // Delta

    let booly = writable(false);

    // On click position

    let startX = writable(0);
    let startY = writable(0);

    // Temporal extra offsets

    let offX = writable(0);
    let offY = writable(0);


    let minX = derived([width,scrollHeight], ([$width,$scrollWidth]) => {
        return $scrollWidth - $width;
    });

    let minY = derived([height,scrollHeight], ([$height,$scrollHeight]) => {
        return $scrollHeight - $height;
    });

    let minScale = derived([scrollWidth , initialWidth, scrollHeight , initialHeight],
        ([$scrollWidth , $initialWidth, $scrollHeight , $initialHeight]) =>
            Math.max(($scrollWidth / $initialWidth), ($scrollHeight/ $initialHeight))
    );

    // Correction

    const getCorrectX = (value:number)=>{
        if(value > 0){
            return 0;
        }
        if($imageObject === undefined) return value;
        if(value < $minX){
            return $minX;
        }
        return value;
    }

    const getCorrectY = (value:number)=>{
        if(value > 0){
            return 0;
        }
        if($imageObject === undefined) return value;
        if(value < $minY){
            return $minY;
        }
        return value;
    }

    // Events

    const Click = (event:Event) => {
        $startX = event.clientX;
        $startY = event.clientY;
        $booly = true;
    }

    const Move = (event:Event)=>{
        if(!$booly) return;
        let x = event.clientX;
        let y = event.clientY;
        let ox = $startX;
        let oy = $startY;
        $offX = x-ox;
        $offY = y-oy;
    }

    const Up = () =>{
        if(!$booly) return;
        $left = getCorrectX($left+$offX);
        $offX = 0;
        $top = getCorrectY($top +$offY);
        $offY = 0;
        $booly = false;
        //TODO
        dispatch('changed', {
            image: ''
        });
    }

    const Save = (event:Event) =>{
        let url: URL;
        let canvas = document.createElement('canvas');
        canvas.width=512;
        canvas.height=512;
        let context = canvas.getContext('2d');
        const original = new Image();
        original.src = src;
        original.crossOrigin= "anonymous";
        original.onload = ()=>{
            const aspect = original.naturalWidth / original.naturalHeight;
            context.drawImage(
                original,                 // Image reference
                -$left / $scale,          // Left offset original
                -$top / $scale,           // Top offset original
                $scrollWidth / $scale,    // Width to be cut
                $scrollHeight / $scale,   // Height to be cut
                0,0,                      // No offset on the target
                512, 512                  // Server prefered Size
            );
            url = canvas.toDataURL("image/png;base64"); // TODO - resize might not be accurate
            dispatch('save', {
                src: url
            });
        };
    }

    const Resize = (event)=>{
        if($scrollWidth === 0) return;
        if(($initialWidth * event.target.value) <= $scrollWidth){
            event.target.value = $minScale;
        } else if(($initialHeight * event.target.value) <= $scrollHeight){
            event.target.value = $minScale;
        }
        let diff = $scale - event.target.value;
        $left -= diff;
        $top -= diff;
        $scale = event.target.value;
    }

    onMount(async()=>{
        let image = new Image();
        image.onload = () => {
            $initialWidth = image.naturalWidth;
            $initialHeight = image.naturalHeight;
            $left = ($scrollWidth - $width) / 2;
            $top = ($scrollHeight - $height) / 2;
        }
        image.src = src;
    });

</script>

<svelte:body on:mouseup={Up} on:mousemove={Move}/>

<div class="cropper">
    <div class="holder">
    <div class="preview {$booly? "dragged": ""}"
        on:mousedown|capture={Click}
        style={`--width:${$width}px;--height:${$height}px;--left:${getCorrectX($left+$offX)}px; --top:${getCorrectY($top+$offY)}px; --src:url(${src});`}
    >
    <div class="measure" bind:this={$imageObject} />
    </div>
    </div>
    <div class="controls">
        <div>
            <input type="range" 
            value={$scale} 
            on:input={Resize} 
            min={Math.max(($scrollWidth / $initialWidth), ($scrollHeight/ $initialHeight))-0.01} 
            max={3+Math.max(($scrollWidth / $initialWidth), ($scrollHeight/ $initialHeight))} 
            step={Math.max((3-($scrollWidth / $initialWidth)) / 100, ((3-$scrollHeight/ $initialHeight)) / 100)}/>
            <span>{Math.round($scale *100,2)}%</span>
        </div>
        {#if $scrollWidth < $width + 0.5}
        <div>
            <input name="x" type="range" min={$minX} max="0" step=".5" bind:value={$left}/>
            <label for="x">
                X
            </label>
        </div>
        {/if}
        {#if $scrollHeight < $height + 0.5}
        <div>
            <input name="y" type="range" min={$minY} max="0" step=".5" bind:value={$top}/>
            <label for="y">
                Y
            </label>
        </div>
        {/if}
        <button on:click={Save}>
            {$_("profile.save-pic")}
        </button>
    </div>
</div>

<style lang="scss">
    .cropper{
        border-radius:2em;
        display:flex;
        flex-direction:column;
        flex-wrap:nowrap;
        align-items:center;
        justify-content:center;
    }
    .holder{
        clip-path: inset(0);
    }
    .preview{
        user-select:none;
        position:relative;
        margin:2em;
        width:20em;
        height:20em;
        &::after{
            content:" ";
            position:absolute;
            inset:0;
            @include avatar-mask;
            background-position: var(--left) var(--top);
            background-size: var(--width) var(--height);
            background-image: var(--src);
            background-repeat: no-repeat;
        }
        &::before{
            content: " ";
            position:absolute;
            left: var(--left);
            top: var(--top);
            width:var(--width);
            height:var(--height);
            background-image: var(--src);
            background-position: left top;
            background-size: var(--width) var(--height);
            background-repeat: no-repeat;
            filter: grayscale(0.3) opacity(0.1) blur(5px) brightness(1) contrast(100%);
            transition: filter 3000ms;
            transition: border 400ms ease-in-out;
            border: 2px solid transparent;
        }
        &.dragged::before{
            filter: grayscale(1) opacity(0.7) blur(2px) brightness(0.6) contrast(120%);
            border: 2px solid white;
        }
        .measure{
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            opacity:0;
        }
    }
    .controls{
        width:20em;
        >div{
                width:17em;
            margin-inline:auto;
            input{
                width:17em;
                margin-block:1em;
            }
        }
        >button{
            margin-block:1em;
            margin-inline:auto;
        }
    }
</style>
