<script lang="ts">
    // Classes
    import Member from "$classes/Member";
    import { ChatMessage, Message, UnsentMessage } from "$classes/Message";
    import type { MessageModifier } from "$classes/ChatLog";
    import type User from "$classes/User";
    // Stores
    import { user } from "$stores/auth";
    import userPreferences from "$stores/userPreferences";
    import { _, time } from "svelte-i18n";
    // Components
    import { fly } from "svelte/transition";
    import AttachmentElement from "$components/chat/Attachment.svelte";
	import Avatar from '$components/chat/Avatar.svelte';

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

    function isReallyVisible(fullVisible: boolean) {
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
    {#if message instanceof ChatMessage}
        <Avatar className="avatar" user={message.author instanceof Member ? message.author.user : message.author}/>
    {/if}
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
    @use "src/styles/message" as *;
</style>
