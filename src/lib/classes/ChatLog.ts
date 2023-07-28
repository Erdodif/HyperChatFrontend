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

    get count(): number {
        return this.#log.length;
    }

    get last(): Message {
        return this.#log[this.count - 1]
    }

    push(message: Message, nonce: string | null = null) {
        console.log(message);
        console.log(this.#log);
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

    get(index) {
        return this.#log[index];
    }

    set(index, value: Message) {
        this.#log[index] = value;
    }

    remove(id: string) {
        for (let i = 0; i < this.#log.length; i++) {
            if (this.#log[i] instanceof ChatMessage && (this.#log[i] as ChatMessage).id == id) {
                this.#log.splice(i, 1);
            }
        }
    }

    makeSent(index, id: string) {
        if (!(this.#log[index] instanceof UnsentMessage)) return;
        this.remove(id);
        this.#log[index] = (this.#log[index] as UnsentMessage).messageSent(id);
    }

    get sendLocation(): string {
        return `channels/${this.channel.id}/messages`;
    }

    get messages() { return [...this.#log] };
}