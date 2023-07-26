import type Guild from "./Guild";
import type User from "./User";
import ChatLog from "./ChatLog";

/**
 * An Object representation of the server's channel instance
 * 
 * It stores it's members, and has an access to it's guild and chatlog
 */
export default class Channel {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly guild: Guild | null;

    protected _members: Map<string, User>;
    /**
     * An array of the current members
     */
    get memberList(): Array<User> {
        return Array.from(this._members.values());
    }

    /**
     * 
     * @param id The user's id (Snowflake)
     * @returns The user or undefined, if not present
     */
    getMember(id: string): User | undefined {
        return this._members.get(id);
    }

    /**
     * Sets the current member to it's new value
     * 
     * It will be accessed via the readonly id parameter of the user, therefore id shall not be changed by this manner!
     * @param member The changed user value
     */
    setMember(member: User) {
        this._members.set(member.id, member);
    }


    chat: ChatLog;

    constructor(id: string, name: string, type: string, guild: Guild = null, members: User[] = []) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.chat = new ChatLog(this);
        this.guild = guild;
        this._members = new Map();
        for (const member of members) {
            this._members.set(member.id, member);
        }
    }

    /**
     * Returns a copy of the channel, with the given guild atached to it
     * @param guild The new guild
     * @returns A new channel instance
     */
    copyWithGuild(guild: Guild): Channel {
        return new Channel(this.id, this.name, this.type, guild, this.memberList, this.chat);
    }
}