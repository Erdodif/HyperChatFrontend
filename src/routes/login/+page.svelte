<script lang="ts">
    export let userName: string;
    export let password: string;

    function navigateToSignUp() {}

    function handleSubmit(event) {}
</script>

<div>
    <form on:submit|preventDefault={handleSubmit}>
        <span>
            <label for="username"> Username </label>
            <input
                type="text"
                id="username"
                bind:value={userName}
                autocomplete="username"
            />
        </span>
        <span>
            <label for="password"> Password </label>
            <input
                type="password"
                id="password"
                bind:value={password}
                placeholder="password"
                autocomplete="current-password"
            />
        </span>
        <button> Login </button>
        <p>
            Don't have an account? How about <strong>Sign the hell up</strong>
        </p>
    </form>
</div>

<style lang="scss">
    div {
        height: 100%;
        form {
            display: flex;
            color: var(--primary);
            flex-direction: column;
            flex-wrap: nowrap;
            gap: 2em;
            margin-inline: auto;
            margin-block: auto;
            width: 30em;
        }
    }
</style>
