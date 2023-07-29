import SocketHandler from "$lib/classes/SocketHandler";
import { writable } from "svelte/store";
import { CustomStore } from "./CustomStore";
import type { EventHandler } from "$lib/classes/SocketHandler";


export class Socket extends CustomStore<SocketHandler>{
    constructor() {
        super(null);
    }

    init(token: string, handlerBoundle: EventHandler[]) {
        this._value = new SocketHandler(token, handlerBoundle);
        this.nofity();
    }
}

export const initializing = writable(true);

let callbacks: (() => void | Promise<void>)[] | "Done" = [];

export function onSocketFinished(callback: () => void) {
    if (callbacks == "Done") {
        callback();
        return;
    }
    callbacks.push(callback);
}

var unsubscribe = initializing.subscribe(async (stillInit) => {
    if (!stillInit) {
        if (callbacks == "Done") {
            return;
        }
        for (const fun of callbacks) {
            fun();
        }
        callbacks = "Done";
        unsubscribe();
    }
});


const socketHandler = new Socket();

export default socketHandler;