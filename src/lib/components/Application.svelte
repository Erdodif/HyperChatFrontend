<script lang="ts">
    
</script>

<div class="chat-holder">
    <div class="le-chat">
        <div class="scrollable">
            <!--<div class="content">
                {#each chatlog.values as msg}
                    <span class="message">{getAuthor(msg)} - {msg.content}</span
                    >
                {/each}
            </div>-->
        </div>
    </div>
    <!--<form on:submit|preventDefault={() => sendMessage(message)}>
        <input type="text" bind:value={message} />
        <button type="submit">Send ship</button>
    </form>-->
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
