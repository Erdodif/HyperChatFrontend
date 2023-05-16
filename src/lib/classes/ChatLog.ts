import type User from "./User";
import { type Message, type SystemMessage, ChatMessage, UnsentMessage } from "./Message";

export default class ChatLog {
    #log: Message[];

    constructor() {
        this.#log = [];
    }

    push(message: Message) {
        for (const msg of this.#log) {
            if ((message instanceof ChatMessage && msg instanceof ChatMessage)
                && (message as ChatMessage).id === (msg as ChatMessage).id || message.equals(msg))return;
        }
        this.#log.push(message);
    }

    get(index) {
        return this.#log[index];
    }

    set(index, value: Message) {
        this.#log[index] = value;
    }

    remove(id:string){
        for (let i = 0; i < this.#log.length; i++){
            if(this.#log[i] instanceof ChatMessage &&(this.#log[i] as ChatMessage).id == id){
                this.#log.splice(i,1);
            }
        }
    }

    makeSent(index, id: string) {
        if (!(this.#log[index] instanceof UnsentMessage)) return;
        this.remove(id);
        this.#log[index] = (this.#log[index] as UnsentMessage).messageSent(id);
    }

    get values() { return [...this.#log] };
}