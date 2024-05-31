<script lang="ts">
    // TODO - rule of thirds(at least), icons, locale, image processing, final design

	import { createEventDispatcher } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { onMount } from 'svelte';
    import { _ } from "svelte-i18n";

    export let src: string | URL;
    const dispatch = createEventDispatcher();

    let modifiedSource = writable("");

    // Initial Info

    let imageObject: HtmlDivElement;

    let left = writable(0);
    let top = writable(0);
    let initialWidth = writable(100);
    let initialHeight = writable(100);
    let scale = writable(1);
    let width = derived([initialWidth, scale], ([$initialWidth,$scale])=>{return $initialWidth * $scale});
    let height = derived([initialHeight, scale], ([$initialHeight,$scale])=>{return $initialHeight * $scale});

    // Delta

    let booly = writable(false);

    // On click position

    let startX = writable(0);
    let startY = writable(0);

    // Temporal extra offsets

    let offX = writable(0);
    let offY = writable(0);

    let minX = derived(width,($width)=>{
        if(imageObject === undefined) return 0;
        return imageObject.scrollWidth - $width;
    })

    let minY = derived(height, ($height) => {
        if(imageObject === undefined) return 0;
        return imageObject.scrollHeight - $height;
    })

    // Correction

    const getCorrectX = (value:number)=>{
        if(value > 0){
            return 0;
        }
        if(imageObject === undefined) return value;
        if(value < $minX){
            return $minX;
        }
        return value;
    }

    const getCorrectY = (value:number)=>{
        if(value > 0){
            return 0;
        }
        if(imageObject === undefined) return value;
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
    }

    const Resize = (event:Event) =>{
        console.log(imageObject.scrollWidth)
        if($width < imageObject.scrollWidth){
            $scale = imageObject.scrollWidth / $initialWidth;
        }
        if($height < imageObject.scrollHeight){
            $scale = imageObject.scrollHeight / $initialHeight;
        }
    }

    const Save = (event:Event) =>{
        dispatch('imagesaved', {
            image: 'TODO'
        })
    }

    onMount(async()=>{
        let image = new Image();
        image.onload = () => {
            $initialWidth = image.naturalWidth;
            $initialHeight = image.naturalHeight;
            $left = (imageObject.scrollWidth - $width) / 2;
            $top = (imageObject.scrollHeight - $height) / 2;
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
    <div class="measure" bind:this={imageObject} />
    </div>
    </div>
    <div class="controls">
        <div>
            <input type="range" min="0.1" max="3" step="0.05" bind:value={$scale} on:change{Resize}/>
            <span>{Math.round($scale *100,2)}%</span>
        </div>
        <div>
            <input name="x" type="range" min={$minX} max="0" step="1" bind:value={$left}/>
            <label for="x">
                X
            </label>
        </div>
        <div>
            <input name="y" type="range" min={$minY} max="0" step="1" bind:value={$top}/>
            <label for="y">
                Y
            </label>
        </div>
        <div>
            <select value="null">
                <option value="null">
                    No grid
                </option>
                <option value="rut">
                    Rule of thirds - TODO
                </option>
            </select>
        </div>
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
            clip-path: inset(0 0 0 0 round 20%);
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
            filter: opacity(0.2) brightness(0.4) blur(4px);
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
