import SocketHandler from "$lib/classes/SocketHandler";
import { readable, writable } from "svelte/store";
import { CustomStore } from "./custom";
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

const socketHandler = new Socket();

export default socketHandler;