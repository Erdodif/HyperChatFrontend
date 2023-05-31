<script lang="ts">
  import {user, token} from "$lib/../stores/auth";
</script>

<div>Main</div>

{#if !$token}
  <div>TF bro...</div>
{:else}
  <div>
    Wellcome {($user).user.displayName}!
  </div>
{/if}
