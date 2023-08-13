import Channel, { type ChannelJson } from "./Channel";
import Member, { type MemberJson } from "./Member";

export type GuildJson = { id: string, name: string, owner_id: string, };

/**
 * Object representation of the Server's guild instance
 * 
 * It stores it's users and channels in a `Map` Object
 */
export default class Guild {
    /**
     * TODO
     * 
     * Snowflake ID
     * 
     * Note: Snowflakes are delivered as strings by the API to ensure language compatibility, but they are guaranteed to be numeric.
     * 
     * Most if not all objects are identified by a snowflake ID with a custom epoch of 2023-01-01T00:00:00Z. Therefore, to obtain the creation timestamp of an object, you can use the following formula:
     * @example    
     * EPOCH = 1672531200000 // 2023-01-01T00:00:00Z in milis
     * created_at = (id >> 22) + EPOCH
     */
    readonly id: string;
    readonly name: string;
    /**
     * The owner's id (Snowflake)
     */
    readonly ownerId: string;

    protected _members: Map<string, Member>;
    /**
     * An array of the current members of the guild
    */
    get memberList(): Array<Member> {
        return Array.from(this._members.values());
    }

    /**
     * 
     * @param id The user's id (Snowflake)
     * @returns The user, or undefined, if not present
     */
    getMember(id: string): Member | undefined {
        return this._members.get(id);
    }

    /**
     * Inserts a new member or overrides it, if already in the set
     * @param member The member Object
     */
    setMember(member: Member) {
        this._members.set(member.user.id, member);
    }

    protected _channels: Map<string, Channel>;
    /**
     * An array of the current channels of the guild
     */
    get channelList(): Array<Channel> {
        return Array.from(this._channels.values());
    }

    /**
     * 
     * @param id The channel' id (Snowflake)
     * @returns The channel, or undefined, if not present
     */
    getChannel(id: string): Channel | undefined {
        return this._channels.get(id);
    }

    /**
     * Sets the given channel to it's new value.
     * 
     * It will be accessed via the readonly `id` parameter of the channel, therefore id shall not be changed by this manner!
     * 
     * If the channel was not in the collection, a copy will be added with `this` as it's new guild.
     * @param channel The channel Object
     */
    setChannel(channel: Channel) {
        if (this._channels.has(channel.id)) {
            this._channels.set(channel.id, channel);
        }
        this._channels.set(channel.id, channel.copyWithGuild(this));
    }

    /**
     * Checks if the channel is in the collection
     * @param id The channel id (Snowflake)
     * @returns true, if the channel is present
     */
    hasChannel(id: string): boolean {
        return this._channels.has(id);
    }

    /**
     * 
     * @param id The channel' id (Snowflake)
     * @returns True, if the deletion was successful, false if it was not present anyway
     */
    removeChannel(id: string): boolean {
        return this._channels.delete(id);
    }

    constructor(id: string, name: string, ownerId: string, channels: Channel[] = [], members: Member[] = []) {
        this.id = id;
        this.name = name;
        this._members = new Map();
        this.ownerId = ownerId;
        for (const member of members ?? []) {
            this._members.set(member.user.id, member);
        }
        this._channels = new Map();
        for (const channel of channels ?? []) {
            this._channels.set(channel.id, channel.copyWithGuild(this));
        }
    }

    /**
     * Creates a minimal instance of the guild based on the given `JSON` object
     * @param content The given `JSON` object
     * @returns A new `Guild`
     */
    static fromJson(content: GuildJson): Guild {
        return new Guild(content.id, content.name, content.owner_id);
    }

    static fromGuildCreate(content: { guild: GuildJson, channels: ChannelJson[], members: MemberJson[] }): Guild {
        const guild = Guild.fromJson(content.guild);
        for (const member of content.members ?? []) {
            guild.setMember(Member.fromJson(member).copyWithGuild(guild));
        }
        for (const channel of content.channels ?? []) {
            guild.setChannel(Channel.fromJson(channel).copyWithGuild(guild));
        }
        return guild;
    }
}