<script lang="ts">
    import type ChatLog from "$lib/classes/ChatLog";
    import { type Message } from "$lib/classes/Message";
    import MessageComponent from "./Message.svelte";
    import Rest from "$lib/classes/Rest";
    import { user } from "$lib/stores/auth";

    export let chatLog: ChatLog;

    let message: string;

    const handleSend = async () => {
        const response = await Rest.sendToServer(chatLog.sendLocation, {
            content: message,
            nonce: `${$user.id}-${chatLog.channel.id}`,
        });
        console.log(`From Rest response:\n${await response.json()}`);
    };
</script>

<section class="chat">
    <div class="messages">
        {#each chatLog.messages as message}
            <MessageComponent {message} />
        {/each}
    </div>
    <form class="send-message" on:submit|preventDefault={handleSend}>
        <input
            type="text"
            name="message"
            bind:value={message}
            id="send-message"
            placeholder="Text..."
        />
        <input type="submit" value="Send" class="button" />
    </form>
</section>

<style lang="scss">
</style>
