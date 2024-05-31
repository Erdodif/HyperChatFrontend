<script lang="ts">
	import Avatar from '$components/chat/Avatar.svelte';
    import type Member from "$classes/Member";
    import { ChatMessage, Message, UnsentMessage } from "$classes/Message";
    import type User from "$classes/User";
    import { user } from "$stores/auth";
    import { _, time } from "svelte-i18n";
    import { each, space } from "svelte/internal";
    import { fly } from "svelte/transition";
    import AttachmentElement from "./Attachment.svelte";
    import Rest, { RestMethod } from "$classes/Rest";
    import type { MessageModifier } from "$classes/ChatLog";
    import userPreferences from "$stores/userPreferences";

    //TODO, set type in chatlog, display (css) accordingly!

    export let message: Message;
    export let modifiers: MessageModifier[] = [];
    let header: string;
    let messageType: string;
    let modifierString: string;

    export const getMessageModifiers = () => {
        return modifierString;
    };
    export const getMessage = () => {
        return message;
    };
    export const getType = () => {
        return messageType;
    };

    const setHeader = () => {
        switch (message.constructor) {
            case UnsentMessage:
                header = $_("message.pending");
                return;
            case ChatMessage:
                header =
                    ((message as ChatMessage).author as Member).nickname ??
                    ((message as ChatMessage).author as User).displayName;
                return;
        }
    };

    const setType = () => {
        switch (message.constructor) {
            case UnsentMessage:
                messageType = "pending";
                return;
            case ChatMessage:
                messageType = (message as ChatMessage).author.equals($user)
                    ? "self"
                    : "someone";
                return;
        }
    };

    const setModifiers = () => {
        modifierString = modifiers[0] ?? "";
        for (let i = 1; i < modifiers?.length; i++) {
            modifierString += " " + modifiers[i];
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

    $: {
        setType();
        setHeader();
        setModifiers();
    }
</script>

{#if message instanceof ChatMessage && message.attachments.length}
    <div
        class="attachments"
        data-modifiers={modifierString}
        data-from={messageType}
        data-layout={$userPreferences.styleLayout}
    >
        {#each message.attachments as attachment}
            <AttachmentElement {attachment} />
        {/each}
    </div>
{/if}
<span
    class="message"
    data-from={messageType}
    bind:this={element}
    data-modifiers={modifierString}
    data-layout={$userPreferences.styleLayout}
    in:fly={{duration:250}}
>
    {#if !(messageType === "self")}
    <Avatar className="avatar" user={message.author}/>
    <div class="author">
        {header}
    </div>
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
</span>

<style lang="scss">
    .message {
        font-size: 1rem;
        width: 95%;
        box-sizing: border-box;
        display: grid;
        align-items:start;
        grid-template-rows: auto auto 1fr;
        grid-template-columns: auto 1fr;
        grid-template-areas: "avatar time" "avatar author" "avatar content";
        &[data-layout="comfy"] {
            padding-block: 0.675em;
            margin-inline: 2em;
            column-gap: 1em;
            row-gap: 1ch;
            .content {
                margin-block-start: 0.5em;
                padding: 0.5em;
            }
        }
        &[data-layout="normal"] {
            padding-block: 0.375em;
            margin-inline: 1em;
            column-gap: 0.5em;
            row-gap: .5ch;
            .content {
                margin-block-start: 0.3em;
                padding: 0.3em;
            }
        }
        &[data-layout="compact"] {
            padding-block: 0.125em;
            margin-inline: 0.625em;
            column-gap: 0.2em;
            row-gap: 0;
            .content {
                margin-block-start: 0em;
                padding: 0.2em;
            }
        }
        :global(.avatar){
            width: 3em;
            height: 3em;
            grid-area: avatar;
        }
        .author {
            font-size: 0.625rem;
            grid-area: author;
        }
        .created {
            font-size: 0.525rem;
            text-align: right;
            grid-area: time;
        }
        .content {
            grid-area: content;
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
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        font-size: 1rem;
        &[data-from="self"] {
            margin-inline-start: auto;
            text-align: right;
            align-items: end;
        }
        &[data-from="someone"] {
            margin-inline-end: auto;
            align-items: start;
        }
    }
</style>
