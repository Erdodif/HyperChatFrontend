import type Guild from "$lib/classes/Guild";
import { CustomDerivedStore, CustomStore, IndirectStore } from "./CustomStore";
import type Channel from "$lib/classes/Channel";
import type { ChatMessage, Message } from "$lib/classes/Message";
import type ChatLog from "$lib/classes/ChatLog";

/**
 * A wrapper Object of a `Map<string,Guild>`, to ensure the store's controlled functionality and it's only used to fulfill the store's needs.
 */
export class GuildSet {
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

    guildByChannelId(channelId: string): Guild {
        return this.searchChannel(channelId).guild;
    }

    searchChannel(id: string): Channel | null {
        let channel: Channel | null = null;
        this._guilds.forEach((guild) => {
            if (guild.hasChannel(id)) {
                channel = guild.getChannel(id)!;
            }
        });
        return channel;
    }

    pushToChatLog(channelId: string, message: Message, nonce: string) {
        this.searchChannel(channelId).chat.push(message, nonce);
    }

    setChannel(channel: Channel) {
        this._guilds.get(channel.guild.id).setChannel(channel);
    }

    addChannel(guildId: string, channel: Channel) {
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

    get(guildId: string): Guild {
        return this._guilds.get(guildId);
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
export class GuildSetStore extends CustomStore<GuildSet> {

    constructor(initialValue: Map<string, Guild> = new Map<string, Guild>()) {
        super(new GuildSet(initialValue));
    }

    set(guild: Guild) {
        this._value.set(guild);
        this.nofity();
    }

    get(guildId: string) {
        return this._value.get(guildId);
    }

    searchChannel(id: string): Channel | null {
        return this._value.searchChannel(id);
    }

    pushToChatLog(channelId: string, message: Message, nonce: string) {
        this._value.pushToChatLog(channelId, message, nonce);
        this.nofity();
    }

    setChannel(channel: Channel) {
        this._value.setChannel(channel);
        this.nofity();
    }

    addChannel(guildId: string, channel: Channel) {
        this._value.addChannel(guildId, channel);
        this.nofity();
    }

    removeChannel(guildId: string, channelId: string): boolean {
        let success = this._value.removeChannel(guildId, channelId);
        this.nofity();
        return success;
    }

    remove(key: string): boolean {
        let success = this._value.remove(key);
        this.nofity();
        return success;
    }

    resetGuildSet() {
        this._value = new GuildSet();
        this.nofity();
    }

    update() {
        this.nofity();
    }

    guildStore(guildId: string): GuildStore {
        return new GuildStore(this, this._value.get(guildId));
    }

    channelStore(guildId: string, channelId: string): ChannelStore {
        return new ChannelStore(this.guildStore(guildId), this._value.get(guildId).getChannel(channelId));
    }

    searchChannelStore(channelId: string): ChannelStore {
        return new ChannelStore(this.guildStore(this._value.guildByChannelId(channelId).id), this._value.searchChannel(channelId));
    }
}

export class ChatStore extends CustomStore<ChatLog>{
    constructor(initLog: ChatLog) {
        super(initLog);
    }

    push(message: Message, nonce: string | null = null) {
        this._value.push(message, nonce);
        this.nofity();
    }

    fillBefore(id:string,...messages:ChatMessage[]){
        this._value.fillBefore(id, ...messages);
        this.nofity();
    }

    fillAfter(id:string,...messages:ChatMessage[]){
        this._value.fillAfter(id, ...messages);
        this.nofity();
    }


}

export const guildSet = new GuildSetStore();
