<script lang="ts">
    import { onMount } from "svelte";
    
    import init, {add} from 'wasm-hyper-chat-connector/module';
    
    let page:"LOGIN"|"REGISTER"|"IN"|"WELCOME" = "LOGIN";

    let number = 0;

    onMount(async ()=>{
        await init();
    });
</script>


<nav>
    <span> Chat app lmao</span>
    <a href="/">Home</a>
    <button on:click={()=>{number = add(number,1)}}> {number} </button>
    <a href="/login">
        Login
    </a>
</nav>

<style lang="scss">
    nav{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: space-between;
    }
</style>
