import type { Readable, Writable } from "svelte/store";
import { writable } from "svelte/store";
import User from "$lib/classes/User";
import Guild from "$lib/classes/Guild";
import { CustomDerivedStore, IndirectStore } from "./custom";
import type { Channel } from "$lib/classes/Guild";

class GuildStore extends IndirectStore<Array<Guild>, Map<string, Guild>> {
    get value(): Array<Guild> {
        return Array.from(this._value.values());
    }

    constructor(initialValue: Map<string, Guild> = new Map<string, Guild>()) {
        super(initialValue);
    }

    set(key: string, value: Guild) {
        this._value.set(key, value);
        this.nofity();
    }

    get(key: string): Guild | undefined {
        return this._value.get(key);
    }

    has(key: string): boolean {
        return this._value.has(key);
    }
}

class ChannelStore extends CustomDerivedStore<{ channel: Channel, guild: Guild }[]> {
    constructor(guilds: GuildStore) {
        super([guilds]);
    }

    refreshValue() {
        this.value = [];
        for (const guild of (this._stores[0] as GuildStore).value) {
            for (const channel of guild.channels) {
                this.value.push({ channel: channel, guild: guild });
            }
        }
    }

    get(id: string): { channel: Channel, guild: Guild } {
        return this.value.find(pair => pair.channel.id == id)
    }
}

export const guilds = new GuildStore();
export const channels = new ChannelStore(guilds);
