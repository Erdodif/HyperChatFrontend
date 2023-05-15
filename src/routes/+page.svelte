<script lang="ts">
  import { onMount } from "svelte";
  import ChatApp from "../lib/components/Chat.svelte";
  import Navigation from "../lib/components/Navigation.svelte";
  import ThemePicker from "../lib/components/theme/ThemePicker.svelte";
  let token: string = null;
  let user: { user_name: string; display_name: string; id: string } = null;
  onMount(() => {
    token = localStorage.getItem("auth-token");
    user = {
      user_name: localStorage.getItem("username"),
      display_name: localStorage.getItem("display_name"),
      id: localStorage.getItem("user_id"),
    };
  });
</script>

<div class="page">
  <header class="nav">
    <Navigation />
  </header>
  <main>
    {#if token === null}
      <div>TF bro...</div>
    {:else}
      <ChatApp {user} />
    {/if}
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
    grid-template-rows: 2em 1fr min-content;
    background-color: var(--background);
    .nav {
      grid-area: head;
      background-color: var(--surface);
    }
    main {
      position: relative;
      grid-area: main;
    }
    aside {
      grid-area: side;
      border-top: 0.2em solid var(--background);
      background-color: var(--surface);
    }
  }
</style>
