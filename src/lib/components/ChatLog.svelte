<script lang="ts">
    import type ChatLog from "$lib/classes/ChatLog";
    import { type Message } from "$lib/classes/Message";
    import MessageComponent from "./Message.svelte";
    import Rest from "$lib/classes/Rest";
    import { user } from "$lib/stores/auth";
    import { _ } from "svelte-i18n";

    export let chatLog: ChatLog;

    let message: string;

    const handleSend = async () => {
        const response = await Rest.sendToServer(chatLog.sendLocation, {
            content: message,
            nonce: `${$user.id}-${chatLog.channel.id}`,
        });
    };
</script>

<div class="chat-holder">
    <div class="messages">
        <div class="scrollable">
            {#each chatLog.messages as message}
                <MessageComponent {message}/>
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
        <input type="submit" value={$_("chat.send-message")} class="button" />
    </form>
</div>

<style lang="scss">
    .message {
        color: var(--on-background);
    }
    .chat-holder {
        overflow: hidden;
        position: absolute;
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
            button {
                font-size: 0.65em;
            }
            grid-area: send;
        }
    }
</style>
