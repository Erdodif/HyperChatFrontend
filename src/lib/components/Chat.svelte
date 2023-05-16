<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { PUBLIC_SOCKET_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import {
        Message,
        SystemMessage,
        ChatMessage,
        UnsentMessage,
    } from "../classes/Message";
    import User from "../classes/User";
    import { readonly } from "svelte/store";
    import ChatLog from "$lib/classes/ChatLog";

    let chatlog: ChatLog = new ChatLog();
    let token: string;
    let message: string;
    export let user;

    onMount(() => {
        token = localStorage.getItem("auth-token");
        if (!token) goto("/login");
        let gateway = new WebSocket(PUBLIC_SOCKET_URL);
        gateway.addEventListener("open", async () => {
            let now = Date.now();
            console.log(`Connecting to ${PUBLIC_SOCKET_URL}`);
            gateway.send(
                JSON.stringify({ event: "IDENTIFY", data: { token: token } })
            );
        });
        gateway.addEventListener("message", (event) => {
            let content = JSON.parse(event.data);
            switch (content.event) {
                case "READY":
                    handleReady(content.data);
                    break;
                case "MESSAGE_CREATE":
                    handleMessage(content.data);
                    break;
                case "MEMBER_JOIN":
                    handleJoin(content.data);
                    break;
                case "MEMBER_LEAVE":
                    handleLeave(content.data);
                    break;
                case "INVALID_SESSION":
                    handleInvalid(content.data);
                    break;
                default:
                    console.warn("server is not talkin to me 💢");
            }
        });

        gateway.addEventListener("close", (ec: CloseEvent) => {
            console.log("Disconnected");
            console.warn(JSON.parse(ec.reason).data);
        });
    });

    function handleReady(ready: any) {
        chatlog.push(new SystemMessage("You just dropped in, tenno."));
        chatlog = chatlog;
        console.log("Connected");
        localStorage.setItem("user", ready);
    }

    function handleMessage(message: any) {
        chatlog.push(
            new ChatMessage(
                new User(
                    message.author.id,
                    message.author.user_name,
                    message.author.display_name
                ),
                message.content,
                message.id
            )
        );
        chatlog = chatlog;
    }

    function handleJoin(join: any) {
        if ((join.id as string) == (user.id as string)) return;
        chatlog.push(
            new SystemMessage(`${join.display_name} is now with you, punk!`)
        );
        chatlog = chatlog;
    }

    function handleLeave(leave: any) {
        chatlog.push(
            new SystemMessage(`${leave.display_name} just left this realm...`)
        );
        chatlog = chatlog;
    }

    function handleInvalid(invalid: any) {
        goto("/login");
    }

    async function sendMessage(message: string) {
        let nonce = `${Date.now()}-\"${message}\"`;
        const response = fetch(PUBLIC_SERVER_URL + "/message/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                content: message,
                nonce: nonce,
            }),
        });
        let index = chatlog.push(new UnsentMessage(user, message, nonce));
        const content = await (await response).json();
        if (content.nonce == nonce) {
            chatlog.makeSent(index, content.id);
            chatlog = chatlog;
        } else {
            console.error(content);
        }
    }

    function getAuthor(message: Message): string {
        if (message instanceof SystemMessage) {
            return "Sys";
        }
        if (
            message instanceof UnsentMessage &&
            (message as UnsentMessage).author === user
        ) {
            return "You";
        } else {
            return (message as ChatMessage).author.display_name;
        }
    }
</script>

<div class="chat-holder">
    <div class="le-chat">
        <div class="scrollable">
            <div class="content">
                {#each chatlog.values as msg}
                    <span class="message">{getAuthor(msg)} - {msg.content}</span
                    >
                {/each}
            </div>
        </div>
    </div>
    <form on:submit|preventDefault={() => sendMessage(message)}>
        <input type="text" bind:value={message} />
        <button type="submit">Send ship</button>
    </form>
</div>

<style lang="scss">
    .message {
        color: var(--on-background);
    }
    .chat-holder {
        overflow: hidden;
        position: absolute;
        inset: 0;
        margin: 0;
        display: grid;
        grid-template-rows: 1fr 2.5em;
        grid-template-areas: "chat" "send";

        .le-chat {
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
                .content {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
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
