import ChatLog from "./ChatLog";
import User from "./User";
import type Channel from "./Channel";

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

    protected _members: Map<string, User>;
    /**
     * An array of the current members of the guild
    */
    get memberList(): Array<User> {
        return Array.from(this._members.values());
    }

    /**
     * 
     * @param id The user's id (Snowflake)
     * @returns The user, or undefined, if not present
     */
    getMember(id: string): User | undefined {
        return this._members.get(id);
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
            this._channels.set(channel.id, channel.copyWithGuild(this));
        }
    }

    /**
     * Creates a minimal instance of the guild based on the given `JSON` object
     * @param content The given `JSON` object
     * @returns A new `Guild`
     */
    static fromJson(content: { id: string, name: string, owner_id: string }): Guild {
        return new Guild(
            content.id,
            content.name,
            content.owner_id,
        );
    }

    /**
     * Fetches the User Object of the guild owner from the server
     * @param token The authentication token
     * @returns An async call of the user
     */
    async getOwner(token: string): Promise<User> {
        return User.fromServer(this.ownerId);
    }
}