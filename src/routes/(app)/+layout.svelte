<script lang="ts">
  import Navigation from "$lib/components/Navigation.svelte";
  import ThemePicker from "$lib/components/theme/ThemePicker.svelte";
  import Guilds from "$lib/components/Guilds.svelte";
  import SocketHandler, { EventHandler } from "$lib/classes/SocketHandler";
  import { onMount } from "svelte";
  import { user } from "$lib/stores/auth";
  import User from "$lib/classes/User";
  import Guild from "$lib/classes/Guild";
  import Channel from "$lib/classes/Channel";
  import { guildSet } from "$lib/stores/guildSet";
  import { token } from "$lib/stores/auth";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Rest from "$lib/classes/Rest";
  import Member from "$lib/classes/Member";
  import Message from "$lib/components/Message.svelte";
  import { ChatMessage } from "$lib/classes/Message";

  let socketHandler: SocketHandler;

  let handlerBundle = [
    new EventHandler("INVALID_SESSION", () => {
      goto(`/login?from=${$page.url.pathname}`);
    }),
    new EventHandler("READY", (event) => {
      $user = User.fromJsonOrRedirect(event.user, $page.url.pathname);
      for (const guildData of event.guilds) {
        guildSet.set(
          new Guild(guildData.id, guildData.name, guildData.owner_id)
        );
      }
    }),
    new EventHandler("GUILD_CREATE", (event) => {
      let channels: Channel[] = [];
      let members: User[] = [];
      for (const member of event.members) {
        members.push(
          new User(
            member.user.id,
            member.user.username,
            member.user.display_name
          )
        );
      }
      for (const channel of event.channels) {
        channels.push(new Channel(channel.id, channel.name, channel.type));
      }
      const guild = new Guild(
        event.guild.id,
        event.guild.name,
        event.guild.owner_id,
        channels,
        members
      );
      guildSet.set(guild);
    }),
    new EventHandler("GUILD_REMOVE", (event) => {
      $guildSet.remove(event.id);
    }),
    new EventHandler("MESSAGE_CREATE", (event) => {
      console.log(event);
      let author: Member = Member.fromJson(event.author);
      let message: ChatMessage = new ChatMessage(
        author,
        event.content,
        event.id
      );
      $guildSet.pushToChatLog(event.channel_id, message, event.nonce);
      guildSet.update();
    }),
  ];

  onMount(() => {
    socketHandler = new SocketHandler($token, handlerBundle);
  });

  $: {
    Rest.token = $token;
  }
</script>

<div class="page">
  <header class="nav">
    <Navigation />
  </header>
  <main>
    <slot />
  </main>
  <aside>
    <Guilds />
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
    grid-template-columns: 3em 1fr;
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
