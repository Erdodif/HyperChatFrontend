import { PUBLIC_SOCKET_URL } from "$env/static/public";
import { goto } from "$app/navigation";

export class EventHandler {
    type: string;
    callback: (event: any) => void;

    constructor(type: string, callback: (event: any) => void) {
        this.type = type;
        this.callback = callback;
    }
}

export default class SocketHandler {
    #token: string;
    #gateway: WebSocket;
    #handlers: Map<string, (event: any) => void>;
    #heart: number;

    constructor(token, handlerBundle: EventHandler[] = []) {
        this.#heart = 0;
        this.#token = token;
        this.#handlers = new Map<string, (event: any) => void>();
        this.attachHandlerbundle(handlerBundle);
        this.#gateway = new WebSocket(PUBLIC_SOCKET_URL);
        this.#gateway.onopen = this.openEvent;
        this.#gateway.onclose = this.closeEvent;
        this.#gateway.onmessage = this.messageEvent;
    }


    changeToken(token: string) {
        this.#token = token;
    }

    addHandler(handler: EventHandler) {
        this.#handlers.set(handler.type, handler.callback);
    }

    attachHandlerbundle(handlerBundle: EventHandler[]) {
        for (const handler of handlerBundle) {
            this.addHandler(handler);
        }
    }

    readonly closeEvent = async (ec) => {
        if (this.#heart != 0) {
            clearInterval(this.#heart);
        }
        console.log(ec.reason);
        console.log("Disconnected");
    }

    readonly openEvent = async () => {
        console.debug(`Connecting to ${PUBLIC_SOCKET_URL}`);
        this.#gateway.send(
            JSON.stringify({ event: "IDENTIFY", data: { token: this.#token } })
        );
    }

    readonly send: ((data: string | ArrayBufferLike | Blob | ArrayBufferView) => void) =
        (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
            this.#gateway.send(data);
        }


    readonly beatManually = () => {
        this.#gateway.send(JSON.stringify({ event: "HEARTBEAT" }));
    }

    startHeartBeats(interval: number) {
        this.beatManually();
        this.#heart = setInterval(this.beatManually, interval);
    }

    readonly messageEvent = async (event: MessageEvent) => {
        let payload = JSON.parse(event.data);
        let fun = this.#handlers.get(payload.event);
        if (fun == undefined) {
            console.warn(`Unhandled event type ${payload.event}:`, payload);
            return;
        }
        fun(payload.data);
    }
}