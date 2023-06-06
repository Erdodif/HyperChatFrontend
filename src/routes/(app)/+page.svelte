<script lang="ts">
  import type User from "$lib/classes/User";
  import Chat from "$lib/components/Chat.svelte";

  import {token} from "$lib/stores/auth";
</script>

<div>Main</div>

<Chat token={$token}/>
