<script lang="ts">
    import type Member from "$lib/classes/Member";
    import {
        SystemMessage,
        ChatMessage,
        Message,
        UnsentMessage,
    } from "$lib/classes/Message";
    import User from "$lib/classes/User";

    export let message: Message;

    const getHeader = () => {
        switch (message.constructor) {
            case SystemMessage:
                return "System message";
            case UnsentMessage:
                return "Pending";
            case ChatMessage:
                if ((message as ChatMessage).author instanceof User)
                    return ((message as ChatMessage).author as User)
                        .displayName;
                else
                    ((message as ChatMessage).author as Member).nickname ??
                        ((message as ChatMessage).author as Member).user
                            .displayName;
        }
    };
</script>

<span>
    {getHeader()}
    {message.content}
</span>
