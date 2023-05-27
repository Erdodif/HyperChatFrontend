<script lang="ts">
    import type User from "../../lib/classes/User";
    export let token: string;
    export let user: User;
</script>

<div>Main</div>

{#if token === null}
    <div>TF bro...</div>
{:else}
    <div>
        Wellcome {user.display_name}!
    </div>
{/if}