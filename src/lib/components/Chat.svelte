<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_SERVER_URL } from "$env/static/public";
    import { PUBLIC_SOCKET_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import { readonly } from "svelte/store";

    let chatlog = [];
    let token: string;
    let message: string;

    onMount(() => {
        token = localStorage.getItem("auth-token");
        if (!token) goto("/login");
        let gateway = new WebSocket(PUBLIC_SOCKET_URL);
        gateway.addEventListener("open", async () => {
            let now = Date.now();
            console.log(`Connecting to ${PUBLIC_SOCKET_URL}`);
            gateway.send(JSON.stringify({ "event":"IDENTIFY", "data": { token: token } }));
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

        gateway.addEventListener("close", (ec:CloseEvent) => {
            console.log("Disconnected");
            console.warn(JSON.parse(ec.reason).data);   
        });
    });

    function handleReady(ready: any) {
        console.log("Connected");
        localStorage.setItem("user", ready);
    }

    function handleMessage(message: any) {
        chatlog.push(message.content);
        console.log(message);
        chatlog = chatlog;
    }

    function handleJoin(join: any) {
        chatlog.push(`${join.display_name} is now with you, punk!`);
        chatlog = chatlog;
    }

    function handleLeave(leave: any) {
        chatlog.push(`${leave} just left this realm...`);
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
            chatlog = chatlog;
        } else {
            console.error(content);
        }
    }
</script>

<div class="chat-holder">
    <div class="le-chat">
        <div class="content">
            {#each chatlog as msg, index (msg)}
                <span class="message">{index} - {msg}</span>
            {/each}
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
        height: 100%;
        margin: 0;
        display: grid;
        grid-template-rows: 1fr 2em;
        grid-template-areas: "chat" "send";
        .content {
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
    }
    .le-chat {
        font-size: 2em;
        grid-area: chat;
    }
    form {
        grid-area: send;
    }
</style>
