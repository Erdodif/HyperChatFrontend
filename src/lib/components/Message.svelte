<script lang="ts">
    import type Member from "$lib/classes/Member";
    import {
        SystemMessage,
        ChatMessage,
        Message,
        UnsentMessage,
    } from "$lib/classes/Message";
    import type User from "$lib/classes/User";
    import type Attachment from "$lib/classes/Attachment";
    import { user } from "$lib/stores/auth";
    import { _, time } from "svelte-i18n";
    import { each, space } from "svelte/internal";
    import { fly } from "svelte/transition";
    import { PUBLIC_FILE_SERVER_URL } from "$env/static/public";

    //TODO, set type in chatlog, display (css) accordingly!

    export let message: Message;
    export let modifiers: string[] = [];

    const getHeader = () => {
        switch (message.constructor) {
            case SystemMessage:
                return $_("message.system");
            case UnsentMessage:
                return $_("message.pending");
            case ChatMessage:
                return (
                    ((message as ChatMessage).author as Member).nickname ??
                    ((message as ChatMessage).author as User).displayName
                );
        }
    };

    const getType = () => {
        switch (message.constructor) {
            case SystemMessage:
                return "system";
            case UnsentMessage:
                return "pending";
            case ChatMessage:
                return (message as ChatMessage).author.id === $user.id
                    ? "self"
                    : "someone";
        }
    };

    export const getBoundingClientRect = () => {
        return element.getBoundingClientRect();
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

    export const scrollTo = () => {
        if (!isReallyVisible(true))
            element.scrollIntoView({ behavior: "smooth" });
    };

    let modifierString = modifiers[0] ?? "";
    for (let i = 1; i < modifiers?.length; i++) {
        modifierString += " " + modifiers[i];
    }
</script>

{#if message instanceof ChatMessage && message.attachments}
    <div
        class="attachments"
        data-modifiers={modifierString}
        data-from={getType()}
    >
        {#each message.attachments as attachment}
            {#if attachment.contentType && attachment.contentType.split("/")[0] === "image"}
                <img
                    src={`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`}
                    alt={`${attachment.message.id}_${attachment.id}_${attachment.filename}`}
                />
            {:else}
                <span>{attachment.contentType}</span>
                <a
                    href={`${PUBLIC_FILE_SERVER_URL}/${attachment.endpoint}`}
                    target="_blank">{attachment.filename}</a
                >
            {/if}
        {/each}
    </div>
{/if}
<span
    class="message"
    data-from={getType()}
    bind:this={element}
    data-modifiers={modifierString}
    transition:fly
>
    {#if !(getType() === "self")}
        <span class="author">
            {getHeader()}
        </span>
    {/if}
    <span class="created">
        <time>
            {$time(message.created, { format: "short" })}
        </time>
    </span>
    {#if message.content}
        <span class="content">
            {message.content}
        </span>
    {/if}
    <!--<button on:click={() => console.log(message)}> Log </button>-->
</span>

<style lang="scss">
    .message {
        font-size: 0.625em;
        width: 95%;
        padding-block: 0.275em;
        margin-inline: 1em;
        box-sizing: border-box;
        display: grid;
        column-gap: 1ch;
        grid-template-areas: "author time -" "content content content";
        grid-template-columns: fit-content fit-content 1fr;
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
            padding: 0.5ch;
            border-inline: 0.1ch solid var(--secondary-variant);
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
            grid-template-areas: "_ _ time" "content content content";
            grid-template-columns: 1fr fit-content fit-content;
            max-width: 70%;
            width: fit-content;
            text-align: right;
            margin-inline-start: auto;
            color: var(--primary);
            .content {
                border-color: var(--primary-variant);
                border-inline-start: none;
            }
        }
        &[data-from="someone"] {
            color: var(--secondary);
            max-width: 70%;
            width: fit-content;
            margin-inline-end: auto;
            .content {
                border-color: var(--secondary-variant);
                border-inline-end: none;
            }
        }

        &[data-modifiers~="same-author"],
        &[data-modifiers|="group-above"] {
            .author {
                display: none;
            }
        }
        &[data-modifiers~="same-content"] {
            position: relative;
            .content {
                color: var(--secondary-variant);
            }
            &[data-from="self"] {
                .content {
                    color: var(--primary-variant);
                }
            }
        }
        &[data-modifiers~="group-above"] {
            grid-template-rows: 1fr;
            grid-template-areas: "content content";
            padding-block-start: 0;
            .content {
                border-block-start: unset;
                border-radius: 0 0 0.8ch 0.8ch;
            }
            .created {
                display: none;
            }
        }
        &[data-modifiers~="group-below"] {
            padding-block-end: 0;
            .content {
                border-block-end: unset;
                border-radius: 0.8ch 0.8ch 0 0;
            }
            .created {
                display: none;
            }
            &[data-modifiers~="group-above"] {
                .content {
                    border-radius: 0;
                }
            }
        }
    }
    .attachments {
        font-size: 0.525em;
        a {
            @include button;
            max-width: 20ch;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
        }
        img{
            max-width: 24em;
            max-height: 24em;
        }
        &[data-from="self"] {
            margin-inline-start: auto;
        }
        &[data-from="someone"] {
            margin-inline-end: auto;
        }
    }
</style>
