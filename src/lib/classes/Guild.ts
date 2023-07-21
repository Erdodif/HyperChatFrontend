import ChatLog from "./ChatLog";
import User from "./User";

export default class Guild {
    readonly id: string;
    readonly name: string;
    readonly ownerId: string;

    protected _members: Map<string, User>;
    get memberList(): Array<User> {
        return Array.from(this._members.values());
    }

    getMember(id: string): User {
        return this._members.get(id);
    }

    protected _channels: Map<string, Channel>;
    get channelList(): Array<Channel> {
        return Array.from(this._channels.values());
    }

    getChannel(id: string): Channel {
        return this._channels.get(id);
    }

    setChannel(channel: Channel) {
        if (this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
        this._channels.set(channel.id, channel.copyWithGuild(this));
    }

    hasChannel(id: string): boolean {
        return this._channels.has(id);
    }

    removeChannel(id: string): boolean {
        return this._channels.delete(id);
    }

    constructor(id: string, name: string, ownerId: string, channels: Channel[] = [], members: User[] = []) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this._members = new Map();
        for (const member of members) {
            this._members.set(member.id, member);
        }
        this._channels = new Map();
        for (const channel of channels) {
            this._channels.set(channel.id, channel);
        }
    }

    static fromJson(content: { id: string, name: string, owner_id: string }): Guild {
        return new Guild(
            content.id,
            content.name,
            content.owner_id,
        );
    }

    async getOwner(token: string): Promise<User> {
        return User.fromServer(token, this.ownerId);
    }
}

export class Channel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly guild: Guild | null;

    protected _members: Map<string, User>;
    get memberList(): Array<User> {
        return Array.from(this._members.values());
    }

    getMember(id: string) {
        return this._members.get(id);
    }

    setMember(member: User) {
        this._members.set(member.id, member);
    }


    chat: ChatLog;

    constructor(id: string, name: string, type: string, guild: Guild = null, members: User[] = [], chatLog: ChatLog = new ChatLog()) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.chat = chatLog;
        this.guild = guild;
        this._members = new Map();
        for (const member of members) {
            this._members.set(member.id, member);
        }
    }

    copyWithGuild(guild: Guild): Channel {
        return new Channel(this.id, this.name, this.type, guild, this.memberList, this.chat);
    }
}