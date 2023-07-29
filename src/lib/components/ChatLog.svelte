<script lang="ts">
    import {
        ChatMessage,
        UnsentMessage,
    } from "$lib/classes/Message";
    import MessageComponent from "./Message.svelte";
    import Rest, { RestMethod } from "$lib/classes/Rest";
    import { token, user } from "$lib/stores/auth";
    import { _ } from "svelte-i18n";
    import { initializing, onSocketFinished } from "$lib/stores/socketHandler";
    import { onMount } from "svelte";
    import type ChatLog from "$lib/classes/ChatLog";
    import { readable, writable } from "svelte/store";
    import { ChatStore } from "$lib/stores/guildSet";

    //determine chat type based on the messages before, remember previous to keep it consistent!


    export let chatInit:ChatLog
    let chatLog = new ChatStore(chatInit);

    let message: string;

    const messageRefs: MessageComponent[] = new Array<MessageComponent>(
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
    }

    const handleSend = async () => {
        chatLog.push(
            new UnsentMessage(
                $user,
                message,
                `${$user.id}-${$chatLog.channel.id}`
            )
        );
        await Rest.sendToServer($chatLog.sendLocation, {
            content: message,
            nonce: `${$user.id}-${$chatLog.channel.id}`,
        });
        scrollToBottom();
    };

    async function previousMessages() {
        let count = messageCapacity;
        if (count > 100) {
            count = 100;
        }
        let idOfFirst: string = (
            $chatLog.messages.find(
                (msg) => msg instanceof ChatMessage
            ) as ChatMessage
        )?.id;
        let messages: Array<any> = await Rest.getJsonFromServer(
            `channels/${$chatLog.channel.id}/messages?${
                idOfFirst ? `before=${idOfFirst}&` : ""
            }limit=${count}`,
            RestMethod.GET
        );
        chatLog.fillBefore(
            idOfFirst,
            ...messages.map((data) => ChatMessage.fromJson(data))
        );
        console.log($chatLog);
    }

    onMount(()=>{
        scrollToBottom();
    });

    onSocketFinished(async () => {
        if($chatLog.count < messageCapacity)
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

    $:chatLog = new ChatStore(chatInit);

</script>

{#if $initializing}
    <span>Loading</span>
{:else}
    <div class="chat-holder">
        <div class="messages">
            <div class="scrollable" bind:this={scrollable}>
                {#each $chatLog.messages as message, index}
                    <MessageComponent
                        {message}
                        bind:this={messageRefs[index]}
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
                placeholder={$_("chat.message-placeholder")}
            />
            <input
                type="submit"
                value={$_("chat.send-message")}
                class="button"
            />
        </form>
    </div>
{/if}

<style lang="scss">
    .chat-holder {
        overflow: hidden;
        height: 100%;
        margin: 0;
        display: grid;
        grid-template-rows: 1fr 2.5em;
        grid-template-areas: "chat" "send";

        .messages {
            font-size: 1.55em;
            grid-area: chat;
            position: relative;
            height: 100%;
            overflow-y: auto;
            .scrollable {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column-reverse;
                flex-wrap: nowrap;
                overflow-y: scroll;
                scroll-behavior: smooth;
                scrollbar-color: var(--primary);
                scrollbar-width: 0.3ch;
                scrollbar-gutter: stable;
                &::-webkit-scrollbar {
                    background-color: transparent;
                    width: 0.3ch;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: var(--primary);
                    border-radius: 1em;
                }
            }
        }
        form {
            display: grid;
            grid-template-columns: 1fr 7ch;
            padding: 0.5em;
            input {
                font-size: 0.65em;
            }
            grid-area: send;
        }
    }
</style>
