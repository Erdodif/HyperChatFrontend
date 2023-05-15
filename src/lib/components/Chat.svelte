<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { PUBLIC_SOCKET_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import { readonly } from "svelte/store";

    let chatlog: { key: string; value: string }[] = [];
    let token: string;
    let message: string;
    export let user;

    onMount(() => {
        console.log(user);
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
            console.log(content);
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
        chatlog.push({ key: ready.id, value: "You just dropped in, tenno." });
        console.log("Connected");
        localStorage.setItem("user", ready);
        chatlog = chatlog;
    }

    function handleMessage(message: any) {
        chatlog.push({ key: message.id, value: message.content });
        console.log(message);
        chatlog = chatlog;
    }

    function handleJoin(join: any) {
        if ((join.id as string) == (user.id as string)) return;
        chatlog.push({
            key: join.id,
            value: `${join.display_name} is now with you, punk!`,
        });
        chatlog = chatlog;
    }

    function handleLeave(leave: any) {
        chatlog.push({
            key: leave.id,
            value: `${leave.display_name} just left this realm...`,
        });
        chatlog = chatlog;
    }

    function handleInvalid(invalid: any) {
        goto("/login");
    }

    async function sendMessage(message: string) {
        const response = await fetch(PUBLIC_SERVER_URL + "/message/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                content: message,
                nonce: message,
            }),
        });
        const content = await response.json();
        if (content.nonce) {
            console.log(chatlog);
            chatlog.at(
                chatlog.findLastIndex(
                    (k) => k.value == (content.nonce as string)
                )
            ).key = content.id;
            chatlog = chatlog;
        } else {
            console.error(content);
        }
    }
</script>

<div class="chat-holder">
    <div class="le-chat">
        <div class="scrollable">
            <div class="content">
                {#each chatlog as msg}
                    <span class="message">{msg.key} - {msg.value}</span>
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
                scrollbar-width: .3ch;
                scrollbar-gutter: stable;
                &::-webkit-scrollbar{
                    background-color: transparent;
                    width: .3ch;
                }
                &::-webkit-scrollbar-thumb{
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
            padding:.5em;
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
