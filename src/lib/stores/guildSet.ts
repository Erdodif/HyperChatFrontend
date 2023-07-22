import type Guild from "$lib/classes/Guild";
import { CustomStore, IndirectStore } from "./custom";
import type { Channel } from "$lib/classes/Guild";

/**
 * A wrapper Object of a `Map<string,Guild>`, to ensure the store's controlled functionality and it's only used to fulfill the store's needs.
 */
class GuildSet {
    protected _guilds: Map<string, Guild>

    constructor(initialValue: Map<string, Guild> = new Map<string, Guild>()) {
        this._guilds = initialValue;
    }

    get guilds(): Map<string, Guild> {
        return this._guilds;
    }

    get guildsArray(): Array<Guild> {
        return Array.from(this._guilds.values());
    }

    get length(): number {
        return this._guilds.size;
    }

    searchChannel(id: string): Channel | null {
        let channel = null;
        this._guilds.forEach((guild) => {
            if (guild.hasChannel(id)) {
                channel = guild.getChannel(id);
            }
        });
        return channel;
    }

    setChannel(channel:Channel){
        this._guilds.get(channel.guild.id).setChannel(channel);
    }

    addChannel(guildId:string, channel: Channel){
        let guild = this._guilds.get(guildId);
        guild.setChannel(channel.copyWithGuild(guild));
    }

    removeChannel(guildId: string, channelId: string): boolean {
        let success = this._guilds.get(guildId).removeChannel(channelId);
        return success;
    }

    has(key: string): boolean {
        return this._guilds.has(key);
    }

    remove(key: string): boolean {
        let success = this._guilds.delete(key);
        return success;
    }

    set(guild: Guild) {
        this.guilds.set(guild.id, guild);
    }
}

/**
 * Custom store Object of a `Guild` Collection.
 * 
 * Channels and guilds shall be accessed and modified through it's methods and properties, or else the store notification system may not be triggered
 */
export class GuildStore extends CustomStore<GuildSet> {

    constructor(initialValue: Map<string, Guild> = new Map<string, Guild>()) {
        super(new GuildSet(initialValue));
    }

    set(guild: Guild) {
        this.value.set(guild);
        this.nofity();
    }

    searchChannel(id: string): Channel | null {
        return this.value.searchChannel(id);
    }

    setChannel(channel: Channel) {
        this.value.setChannel(channel);
        this.nofity();
    }

    addChannel(guildId: string, channel: Channel) {
        this.value.addChannel(guildId,channel);
        this.nofity();
    }

    removeChannel(guildId: string, channelId: string): boolean {
        let success = this.value.removeChannel(guildId, channelId);
        this.nofity();
        return success;
    }

    remove(key: string): boolean {
        let success = this.value.remove(key);
        this.nofity();
        return success;
    }
}

export const guildSet = new GuildStore();
