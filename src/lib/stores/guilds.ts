import type { Readable } from "svelte/store";
import { writable } from "svelte/store";
import User from "$lib/classes/User";
import type Guild from "$lib/classes/Guild";

class GuildStore implements Readable<Array<Guild>> {
    #value: Map<string, Guild>;
    get value(): Array<Guild> {
        return Array.from(this.#value.values());
    }
    callbacks: Array<(value: Array<Guild>) => void>

    constructor(initialValue: Map<string, Guild> = new Map<string, Guild>()) {
        this.#value = initialValue;
        this.callbacks = [];
    }

    subscribe(callback: (value: Array<Guild>) => void): (() => void) {
        callback(this.value);
        this.callbacks.push(callback);
        return () => this.unsubscribe(callback);
    }

    unsubscribe(callback: (value: Array<Guild>) => void) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }

    #nofity() {
        for (const callback of this.callbacks) {
            callback(this.value);
        }
    }

    set(key: string, value: Guild) {
        this.#value.set(key, value);
        this.#nofity();
    }

    get(key: string): Guild | undefined {
        return this.#value.get(key);
    }

    has(key: string): boolean {
        return this.#value.has(key);
    }
}

export const guilds = new GuildStore();
