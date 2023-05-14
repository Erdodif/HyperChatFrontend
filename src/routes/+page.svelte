<script lang="ts">
  import { onMount } from "svelte";
  import Navigation from "../lib/components/Navigation.svelte";
  import ThemePicker from "../lib/components/theme/ThemePicker.svelte";
  let token:string = null;
  let username:string = null;
  onMount(()=>{
    token = localStorage.getItem("auth-token");
    username = localStorage.getItem("username");
  });
</script>

<div class="page">
  <header class="nav">
    <Navigation />
  </header>
  <main>
    {#if token === null}
      <div>
        Hey, you're not logged in yet. <br/> f u
      </div>
      {:else}
      <div>
        Welcome {username}
      </div>
    {/if}
  </main>
  <aside>
    <ThemePicker />
  </aside>
</div>

<style lang="scss">
  :global(:root){
    color:var(--on-background);
    background-color: var(--background);
  }
  .page{
    width: 100%;
    min-height: 100%;
    display: grid;
    grid-template-areas: 'head head' 'side main';
    grid-template-columns: 23ch 1fr;
    align-items: stretch;
    grid-template-rows: 2em 1fr min-content;
    background-color: var(--background);
    .nav{
      grid-area: head;
      background-color: var(--surface);
    }
    main{
      grid-area: main;
    }
    aside{
      grid-area: side;
      border-top: .2em solid var(--background);
      background-color:var(--surface);
    }
  }
</style>
