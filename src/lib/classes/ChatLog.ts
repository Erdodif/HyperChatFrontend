import type User from "./User";
import { type Message, type SystemMessage, ChatMessage, UnsentMessage } from "./Message";
import type Channel from "./Channel";

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
    push(message: Message, nonce: string | null = null) {
        if (nonce !== null) {
            let index = this.messages.findIndex((msg, _) => (msg instanceof UnsentMessage && msg.nonce === nonce) || msg.equals(message));
            if (index !== -1) {
                this.set(index, message);
                return;
            }
        }
        this.#log.unshift(message);
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
    get(index) {
        return this.#log[index];
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

    /**
     * Finalize the message on the given index.
     * 
     * If the message isn't `UnsentMessage`, nothing will change
     * @param index The location of the message
     * @param id The id assigned to the ChatMessage
     */
    makeSent(index, id: string) {
        if (!(this.#log[index] instanceof UnsentMessage)) return;
        this.remove(id);
        this.#log[index] = (this.#log[index] as UnsentMessage).messageSent(id);
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