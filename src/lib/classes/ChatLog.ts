import type User from "./User";
import { type Message, ChatMessage, UnsentMessage } from "./Message";
import type Channel from "./Channel";

/**
 * If the frequency of messages from the same person does not exceed this many seconds,
 * they will be grouped together, indicating that those messages may semantically be connected
 *
 * This should be user-available setting in the future
 */
export const MESSAGE_SECONDS_THRESHOLD = 60;

export enum MessageModifier {
    SAME_AUTHOR = "same_author",
    GROUP_ABOVE = "group_above",
    GROUP_BELOW = "group_below",
    SAME_CONTENT = "same_content",
    ONLY_ATTACHMENT = "only_attachment"
}

export default class ChatLog {
    #log: Message[];
    readonly channel: Channel;

    constructor(channel: Channel) {
        this.#log = [];
        this.channel = channel;
    }

    /**
     * Returns the current message count of the chatlog
     */
    get count(): number {
        return this.#log.length;
    }

    /**
     * Returns the last registered element
     */
    get last(): Message {
        return this.#log[this.count - 1]
    }

    /**
     * Inserts a new Message into the chatLog.
     * 
     * If there is an `UnsentMessage` with the matching nonce, that message will be finalized
     * 
     * The new position will always be the very first position of the array
     * @param message The Message Object
     * @param nonce A possible nonce from the server
     */
    push(message: Message, nonce: string | null = null):number {
        if (nonce !== null) {
            let index = this.messages.findIndex((msg, _) => (msg instanceof UnsentMessage && msg.nonce === nonce) || msg.equals(message));
            if (index !== -1) {
                this.set(index, message);
                return;
            }
        }
        return this.#log.unshift(message);
    }

    //Follows cronological order
    fillBefore(id: string, ...messages: ChatMessage[]) {
        let index = this.messages.findIndex((msg) => msg instanceof ChatMessage && msg.id === id);
        if (index > -1) {
            this.#log.splice(index, 0, ...messages);
            return;
        }
        index = this.messages.findLastIndex((msg) => msg instanceof ChatMessage && msg.id < id);
        if (index == -1) index = 0;
        this.#log.splice(index, 0, ...messages);
    }

    fillAfter(id: string, ...messages: ChatMessage[]) {
        let index = this.messages.findIndex((msg) => msg instanceof ChatMessage && msg.id === id);
        if (index > -1) {
            this.#log.splice(index + 1, 0, ...messages);
            return;
        }
        index = this.messages.findIndex((msg) => msg instanceof ChatMessage && msg.id > id);
        if (index == -1) index = 0;
        this.#log.splice(index + 1, 0, ...messages);

    }

    /**
     * Returns the message instance on the given location
     * @param index The location
     * @returns The Message Object on the given index
     */
    get(index: number) {
        return this.#log[index];
    }

    /**
     * Defines modifiers on a message Object compared to the next and previous message
     *
     * Based on creation time, author and content
     * @param index
     */
    getModifiers(index: number): MessageModifier[] {
        let modifiers: MessageModifier[] = [];
        if (index < 0) {
            return modifiers;
        }
        let current = this.get(index);
        let previous = this.get(index + 1);
        let next = this.get(index - 1);
        if (!(current instanceof ChatMessage)) {
            return modifiers;
        }
        if (!current.content){
            modifiers.push(MessageModifier.ONLY_ATTACHMENT);
        }
        if (
            previous &&
            previous instanceof ChatMessage &&
            previous.sameAuthor(current)
        ) {
            modifiers.push(MessageModifier.SAME_AUTHOR);
            if (current.secondsBetween(previous) < MESSAGE_SECONDS_THRESHOLD) {
                modifiers.push(MessageModifier.GROUP_ABOVE);
            }
        }
        if (next && next instanceof ChatMessage && next.sameAuthor(current)) {
            if (next.sameContent(current)) {
                modifiers.push(MessageModifier.SAME_CONTENT);
            }
            if (next.secondsBetween(current) < MESSAGE_SECONDS_THRESHOLD) {
                modifiers.push(MessageModifier.GROUP_BELOW);
            }
        }
        return modifiers;
    }

    /**
     * Overrides a message object on the specified index
     * @param index The location
     * @param value The new Message Object
     */
    set(index, value: Message) {
        this.#log[index] = value;
    }

    /**
     * Removes the specified Message from the chatlog
     * @param id The Message id
     */
    remove(id: string) {
        for (let i = 0; i < this.#log.length; i++) {
            if (this.#log[i] instanceof ChatMessage && (this.#log[i] as ChatMessage).id == id) {
                this.#log.splice(i, 1);
            }
        }
    }

    delete(index:number){
        this.#log.splice(index,1);
    }

    /**
     * Finalize the message on the given index.
     * 
     * If the message isn't `UnsentMessage`, nothing will change
     * @param index The location of the message
     * @param id The id assigned to the ChatMessage
     */
    makeSent(index:number,message:ChatMessage ) {
        if (!(this.#log[index] instanceof UnsentMessage)) return;
        message.channel = this.channel;
        this.#log.splice(index,1,message);
    }

    /**
     * The path where new messages can be fetched
     */
    get sendLocation(): string {
        return `channels/${this.channel.id}/messages`;
    }

    /**
     * A copy of the messages
     */
    get messages() { return [...this.#log] };
}