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
    import { _, time } from "svelte-i18n";

    //TODO, set type in chatlog, display (css) accordingly!

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

    let element: HTMLSpanElement;

    function isReallyVisible(fullVisible) {
        var parentRect = (
            element.parentNode as HTMLElement
        ).getBoundingClientRect();
        var rect = arguments[2] || element.getBoundingClientRect();
        return (
            (fullVisible
                ? rect.top >= parentRect.top
                : rect.bottom > parentRect.top) &&
            (fullVisible
                ? rect.bottom <= parentRect.bottom
                : rect.top < parentRect.bottom)
        );
    }

    export let context:
        | "single"
        | "same-author"
        | "same-author-time"
        | "same-time" = "single";

    export const scrollTo = () => {
        if (!isReallyVisible(true))
            element.scrollIntoView({ behavior: "smooth" });
    };
</script>

<span
    class="message"
    data-from={getType()}
    bind:this={element}
    data-context={context}
>
    {#if !(getType() === "self")}
        <span class="author">
            {getHeader()}
        </span>
    {/if}
    <span class="created">
        <time>
            {$time(message.created, {format:"short"})}
        </time>
    </span>
    <span class="content">
        {message.content}
    </span>
    <!--<button on:click={() => console.log(message)}> Log </button>-->
</span>

<style lang="scss">
    .message {
        font-size: 0.765em;
        width: 95%;
        margin-block: 0.275em;
        margin-inline: 1em;
        display: grid;
        grid-template-areas: "author time" "content content";
        grid-template-columns: 1fr 5ch;
        .author {
            font-size: 0.525em;
            grid-area: author;
        }
        &[data-context="same-author"]{
            .author{
                display: none;
            }
        }
        .created {
            font-size: 0.375em;
            margin-inline-end: 1ch;
            text-align: right;
            grid-area: time;
        }
        .content {
            grid-area: content;
            padding: 0.5ch;
            border: 0.1ch solid var(--secondary-variant);
            border-radius: 0.8ch;
        }
        &[data-from="system"] {
            color: var(--secondary-variant);
        }
        &[data-from="pending"] {
            max-width: 60%;
            width: fit-content;
            margin-inline-start: auto;
            color: var(--primary-variant);
        }
        &[data-from="self"] {
            max-width: 70%;
            width: fit-content;
            text-align: right;
            margin-inline-start: auto;
            color: var(--primary);
        }
        &[data-from="someone"] {
            max-width: 70%;
            width: fit-content;
            margin-inline-end: auto;
        }
    }
</style>
