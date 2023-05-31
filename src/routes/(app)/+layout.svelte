<script lang="ts">
  import { onMount } from "svelte";
  import Navigation from "$lib/components/Navigation.svelte";
  import ThemePicker from "$lib/components/theme/ThemePicker.svelte";
  import {getUser, user, token} from "$lib/../stores/auth";

  onMount(()=>{
    $token = localStorage.getItem("auth-token");
    getUser($token);
  });
</script>

<div class="page">
  <header class="nav">
    <Navigation />
  </header>
  <main>
    <slot/>
  </main>
  <aside>
    <ThemePicker />
  </aside>
</div>

<style lang="scss">
  :global(:root) {
    color: var(--on-background);
    background-color: var(--background);
  }
  .page {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas: "head head" "side main";
    grid-template-columns: 23ch 1fr;
    align-items: stretch;
    grid-template-rows: 2.175em 1fr min-content;
    background-color: var(--background);
    .nav {
      grid-area: head;
      background-color: var(--surface);
    }
    main {
      position: relative;
      max-width: 100%;
      grid-area: main;
    }
    aside {
      grid-area: side;
      border-top: 0.2em solid var(--background);
      background-color: var(--surface);
    }
  }
</style>
