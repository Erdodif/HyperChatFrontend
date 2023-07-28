<script lang="ts">
    import type Member from "$lib/classes/Member";
    import {
        SystemMessage,
        ChatMessage,
        Message,
        UnsentMessage,
    } from "$lib/classes/Message";
    import User from "$lib/classes/User";
    import { user } from "$lib/stores/auth";
    import { _ } from "svelte-i18n";

    export let message: Message;

    let author: User;

    if ((message as ChatMessage).author instanceof User) {
        author = (message as ChatMessage).author as User;
    } else {
        author = ((message as ChatMessage).author as Member).user;
    }

    const getHeader = () => {
        switch (message.constructor) {
            case SystemMessage:
                return $_("message.system");
            case UnsentMessage:
                return $_("message.pending");
            case ChatMessage:
                return author.displayName;
        }
    };

    const getType = () => {
        switch (message.constructor) {
            case SystemMessage:
                return "system";
            case UnsentMessage:
                return "pending";
            case ChatMessage:
                if (author.id == $user.id) return "self";
                else return "someone";
        }
    };
</script>

<span class="message" data-from={getType()}>
    {#if !(getType() === "self")}
        <span class="author">
            {getHeader()}
        </span>
    {/if}
    <span class="created">
        <time>
            {message.created.toLocaleTimeString()}
        </time>
    </span>
    <span class="content">
        {message.content}
    </span>
    <!--<button on:click={() => console.log(message)}> Log </button>-->
</span>

<style lang="scss">
    .message {
        width: 95%;
        margin-block: 0.275em;
        margin-inline: 1em;
        border: 0.1ch solid var(--secondary-variant);
        border-radius: 0.8ch;
        display: grid;
        grid-template-areas: "author time" "content content";
        grid-template-columns: 1fr 5ch;
        .author {
            font-size: 0.525em;
            grid-area: author;
        }
        .created {
            font-size: 0.375em;
            margin-inline-end: 1ch;
            text-align: right;
            grid-area: time;
        }
        .content {
            grid-area: content;
        }
        &[data-from="system"] {
            color: var(--secondary-variant);
        }
        &[data-from="pending"] {
            width: 60%;
            margin-inline-start: auto;
            color: var(--primary-variant);
        }
        &[data-from="self"] {
            width: 70%;
            margin-inline-start: auto;
            color: var(--primary);
        }
        &[data-from="someone"] {
            width: 70%;
            margin-inline-end: auto;
        }
    }
</style>
