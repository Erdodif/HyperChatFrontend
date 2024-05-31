<script lang="ts">
    import { ChatMessage, UnsentMessage } from "$classes/Message";
    import MessageComponent from "./Message.svelte";
    import Rest, { RestMethod } from "$classes/Rest";
    import { user } from "$stores/auth";
    import { _ } from "svelte-i18n";
    import socketHandler, { initializing, onSocketFinished } from "$stores/socketHandler";
    import { onMount } from "svelte";
    import type ChatLog from "$classes/ChatLog";
    import { ChatStore } from "$stores/guildSet";
    import { writable } from "svelte/store";
    import MimeImg from "./MimeImg.svelte";

    const MAX_ATTACHMENT_COUNT = 10;

    export let chatInit: ChatLog;
    let chatLog = new ChatStore(chatInit);

    let message: string;

    let messageRefs: MessageComponent[] = new Array<MessageComponent>(
        $chatLog.count
    );

    /**
     * An integer value about how many standard message fits the screen
     *
     * this value gets measured after the component mounted
     */
    let messageCapacity: number = 20;

    /**
     * Creates a temporal svelte component to calculate actual height based on the applied styles
     *
     * The value gets stored in the messageCapacity property
     */
    function calculateVerticalMessageCapacity() {
        let height = scrollable.getBoundingClientRect().height;
        let pseudoComponent = new MessageComponent({
            target: scrollable,
            props: { message: new ChatMessage($user, ".", "") },
        });
        let messageHeight = pseudoComponent.getBoundingClientRect().height;
        pseudoComponent.$destroy();
        messageCapacity = Math.ceil(height / messageHeight);
        if (messageCapacity > 100) {
            messageCapacity = 100;
        }
    }

    const handleSend = async () => {
        if (!message && !$attachments.length) {
            return;
        }
        let index = chatLog.push(
            new UnsentMessage(
                $user,
                message ?? "attachments...",
                `${$user.id}-${$chatLog.channel.id}`
            )
        );
        let jsonPart = {
            content: message,
            nonce: `${$user.id}-${$chatLog.channel.id}`,
        };
        let messageForm = new FormData();
        if (message) {
            messageForm.append(
                "json",
                new Blob([JSON.stringify(jsonPart)], {
                    type: "application/json",
                })
            );
        }
        if (attachments) {
            let i = 0;
            for (const file of $attachments) {
                messageForm.append(`attachment-${i}`, file);
                i++;
            }
        }
        let data = await Rest.sendMultipart(
            $chatLog.sendLocation,
            messageForm,
            RestMethod.POST
        );
        chatLog.delete(index);
        message = "";
        $attachments = [];
        scrollToBottom();
    };

    async function previousMessages() {
        let count = messageCapacity;
        let first = $chatLog.messages.find(
                (msg) => msg instanceof ChatMessage
            ) as ChatMessage
        let idOfFirst: string = first?first.id:"";
        let messages: Array<any> = await Rest.getJsonFromServer(
            `channels/${$chatLog.channel.id}/messages?${
                idOfFirst ? `before=${idOfFirst}&` : ""
            }limit=${count}`,
            RestMethod.GET
        );
        if (messages.length) {
            chatLog.fillBefore(
                idOfFirst,
                ...messages.map((data) =>
                    ChatMessage.fromJson(data, $chatLog.channel)
                )
            );
        }
    }

    onMount(() => {
        scrollToBottom();
    });

    onSocketFinished(async () => {
        if ($chatLog.count < messageCapacity)
            //sus, because we shall rather clear and re-initialize.
            // The server caps at 100, and there can be more messages before that
            await previousMessages();
    });

    onMount(() => {
        calculateVerticalMessageCapacity();
    });

    let scrollable: HTMLDivElement;

    const scrollToBottom = () => {
        messageRefs[0]?.scrollTo();
    };

    //$: chatLog = new ChatStore(chatInit);
    let attachments = writable<Array<File>>([]);

    let attachment: HTMLInputElement;

    const handleAttachentsUploaded = (event: Event) => {
        if (
            $attachments.length + attachment.files.length >
            MAX_ATTACHMENT_COUNT
        ) {
            console.error(
                `Maximum attachment count reached (which is ${MAX_ATTACHMENT_COUNT})`
            );
            alert(
                $_("errors.chat.max-attachment-reached", {
                    values: {
                        maxcount: MAX_ATTACHMENT_COUNT,
                        leftover:
                            $attachments.length +
                            attachment.files.length -
                            MAX_ATTACHMENT_COUNT,
                    },
                })
            );
        }
        for (const file of attachment.files) {
            if ($attachments.length < MAX_ATTACHMENT_COUNT) {
                $attachments.push(file);
                $attachments = $attachments;
            } else {
                attachment.value = "";
                return;
            }
        }
        attachment.value = "";
    };
</script>

{#if $initializing}
    <span>$_('chat.loading')</span>
{:else}
    <div class="chat-holder">
        <div class="messages">
            <div class="scrollable" bind:this={scrollable}>
                {#each $chatLog.messages as message, index (message.id)}
                    <MessageComponent
                        {message}
                        bind:this={messageRefs[index]}
                        modifiers={$chatLog.getModifiers(index)}
                    />
                {/each}
            </div>
        </div>
        <form class="send-message" on:submit|preventDefault={handleSend}>
            <input
                type="text"
                name="message"
                bind:value={message}
                id="send-message"
                placeholder={$_("chat.message-placeholder")+ $chatLog.channel.id}
            />
            <input
                type="submit"
                value={$_("chat.send-message")}
                class="button"
            />
            {#if attachments}
                <div class="attachments">
                    {#each $attachments as file, index}
                        {#if file.type && file.type.split("/")[0] === "image"}
                            <div class="attachment attachment__image">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`attachment-${index}`}
                                />
                                <span class="file__name">
                                    {file.name}
                                </span>
                            </div>
                        {:else}
                            <div class="attachment attachment__file">
                                <MimeImg mime={file.type} />
                                <span class="file__name">
                                    {file.name}
                                </span>
                            </div>
                        {/if}
                    {/each}
                    <button on:click={() => ($attachments = [])}> X </button>
                </div>
            {/if}
            <label class="attach">
                {$_("chat.attachment.icon")}
                <input
                    type="file"
                    bind:this={attachment}
                    multiple
                    on:change={handleAttachentsUploaded}
                />
            </label>
        </form>
    </div>
{/if}

<style lang="scss">
    .chat-holder {
        overflow: hidden;
        height: 100%;
        margin: 0;
        display: grid;
        grid-template-rows: 1fr min-content;
        grid-template-areas: "chat" "send";

        .messages {
            font-size: 1.55em;
            grid-area: chat;
            position: relative;
            height: 100%;
            overflow-y: auto;
            .scrollable {
                margin-inline: 0.275em;
                padding-inline: 0.275em;
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column-reverse;
                flex-wrap: nowrap;
                overflow-y: scroll;
                @include scrollbar;
            }
        }
        form {
            display: grid;
            grid-template-columns: 3ch 1fr 7ch;
            grid-template-rows: fit-content 1fr;
            grid-template-areas: "attachments attachments attachments" "attach message submit";
            padding: 0.5em;
            grid-area: send;
            input {
                font-size: 0.65em;
                &[type="text"] {
                    grid-area: message;
                }
                &[type="submit"] {
                    width: 100%;
                    height: 100%;
                    grid-area: submit;
                }
                &[type="file"] {
                    opacity: 0;
                    width: 0;
                    height: 0;
                    grid-area: attach;
                }
            }
            .attach {
                background-color: var(--primary-variant);
                &:hover {
                    background-color: var(--secondary-variant);
                }
            }
            .attachments {
                position: relative;
                background-color: var(--surface);
                grid-area: attachments;
                display: flex;
                max-height: 100%;
                overflow-y: hidden;
                overflow-x: auto;
                flex-direction: row;
                flex-wrap: nowrap;
                .attachment {
                    position: relative;
                    display: grid;
                    align-items: center;
                    &__image {
                        grid-template-rows: 1fr 1em;
                        img {
                            max-height: 12em;
                            max-width: 16em;
                            border-radius: 1em;
                            grid-row-start: 1;
                            grid-row-end: 2;
                            border: 0.2ch dashed var(--secondary-variant);
                        }
                        .file {
                            &__name {
                                color: var(--primary);
                                background: var(--surface);
                                text-overflow: ellipsis;
                                border-radius: 1ch 0 0 0;
                                padding-inline: 1ch;
                                grid-row: 2;
                                right: 0;
                                bottom: 0;
                            }
                        }
                    }
                    &__file {
                        grid-template-rows: 1fr 1fr;
                        position: relative;
                        min-width: 4em;
                        min-height: 3em;
                        max-height: 12em;
                        max-width: 16em;
                        border-radius: 1em;
                        border: 0.3ch dashed var(--primary-variant);
                        .file {
                            &__name {
                                color: var(--primary);
                                padding-inline: 1ch;
                                position: absolute;
                                right: 50%;
                                bottom: 0;
                            }
                        }
                    }
                }
                button {
                    position: absolute;
                    right: 1em;
                    top: 0.525em;
                }
            }
        }
    }
</style>
