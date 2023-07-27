<script lang="ts">
    import type Member from "$lib/classes/Member";
    import {
        SystemMessage,
        ChatMessage,
        Message,
        UnsentMessage,
    } from "$lib/classes/Message";
    import User from "$lib/classes/User";
    import { _ } from "svelte-i18n";

    export let message: Message;

    const getHeader = () => {
        switch (message.constructor) {
            case SystemMessage:
                return $_("message.system");
            case UnsentMessage:
                return $_("message.pending");
            case ChatMessage:
                if ((message as ChatMessage).author instanceof User)
                    return ((message as ChatMessage).author as User)
                        .displayName;
                else
                    return ((message as ChatMessage).author as Member).nickname;
        }
    };
</script>

<span class="message">
    <span class="author">
        {getHeader()}
    </span>
    <span class="created">
        <time>
            {message.created.toLocaleTimeString()}
        </time>
    </span>
    <span class="content">
        {message.content}
    </span>
    <button on:click={() => console.log(message)}> Log </button>
</span>

<style lang="scss">
    .message {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
</style>
