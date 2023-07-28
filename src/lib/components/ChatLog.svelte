<script lang="ts">
    import type ChatLog from "$lib/classes/ChatLog";
    import { ChatMessage, UnsentMessage } from "$lib/classes/Message";
    import MessageComponent from "./Message.svelte";
    import Rest from "$lib/classes/Rest";
    import { user } from "$lib/stores/auth";
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import User from "$lib/classes/User";
    import Member from "$lib/classes/Member";

    //determine chat type based on the messages before, remember previous to keep it consistent!

    export let chatLog: ChatLog;

    let message: string;

    const messageRefs: MessageComponent[] = new Array<MessageComponent>(
        chatLog.count
    );

    const handleSend = async () => {
        chatLog.push(
            new UnsentMessage(
                $user,
                message,
                `${$user.id}-${chatLog.channel.id}`
            )
        );
        const response = await Rest.sendToServer(chatLog.sendLocation, {
            content: message,
            nonce: `${$user.id}-${chatLog.channel.id}`,
        });
        scrollToBottom();
    };

    async function previousMessages(count:number = 20){
        let idOfFirst:string = (chatLog.messages.find(msg=>msg instanceof ChatMessage) as ChatMessage)?.id
        chatLog.fillBefore(
            idOfFirst,
            ...(
                (await Rest.getJsonFromServer(
                    `channels/${chatLog.channel.id}/messages?${idOfFirst?`before=${idOfFirst},`:""}count=${count}`
                )) as Array<any>
            ).map((data) => {
                let author: User | Member;
                if (data.author.id) {
                    author = User.fromJson(data.author);
                } else {
                    author = Member.fromJson(data.author);
                }
                return new ChatMessage(author, data.content, data.id);
            })
        );
    }

    onMount(async () => {
        //sus, because we shall rather clear and re-initialize.
        // The server caps at 100, and there can be more messages before that
        let idOfLast:string = (chatLog.messages.findLast(msg=>msg instanceof ChatMessage) as ChatMessage)?.id;
        chatLog.fillAfter(
            idOfLast,
            ...(
                (await Rest.getJsonFromServer(
                    `channels/${chatLog.channel.id}/messages?${idOfLast?`before=${idOfLast}`:""}`
                )) as Array<any>
            ).map((data) => {
                let author: User | Member;
                if (data.author.id) {
                    author = User.fromJson(data.author);
                } else {
                    author = Member.fromJson(data.author);
                }
                return new ChatMessage(author, data.content, data.id);
            })
        );
        scrollToBottom();
    });

    const scrollToBottom = () => {
        messageRefs[messageRefs.length - 1]?.scrollTo();
    };
</script>

<div class="chat-holder">
    <div class="messages">
        <div class="scrollable">
            {#each chatLog.messages.reverse() as message, index}
                <MessageComponent {message} bind:this={messageRefs[index]} />
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
