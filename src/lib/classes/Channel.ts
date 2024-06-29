import type Guild from "./Guild";
import type User from "./User";
import ChatLog from "./ChatLog";
import type Member from "./Member";

export type ChannelJson = { id: string, name: string, type: string, guild_id: string };

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

    protected _members: Map<string, Member>;
    /**
     * An array of the current members
     */
    get memberList(): Array<Member> {
        return Array.from(this._members.values());
    }

    /**
     * 
     * @param id The user's id (Snowflake)
     * @returns The user or undefined, if not present
     */
    getMember(id: string): Member | undefined {
        return this._members.get(id);
    }

    /**
     * Sets the current member to it's new value
     * 
     * It will be accessed via the readonly id parameter of the user, therefore id shall not be changed by this manner!
     * @param member The changed user value
     */
    setMember(member: Member) {
        this._members.set(member.user.id, member);
    }


    chat: ChatLog;

    constructor(id: string, name: string, type: string, guild: Guild | null = null, members: Member[] = [], chatLog: ChatLog | null = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.guild = guild;
        this._members = new Map();
        for (const member of members) {
            this._members.set(member.user.id, member);
        }
        if (chatLog) {
            this.chat = chatLog;
        }
        else {
            this.chat = new ChatLog(this);
        }
    }

    /**
     * Creates a Channel instance from raw json.
     * 
     * The guild property will remain unset, if the guildSet reference is not present, or cannot be found.
     * @param content The given Json Object
     * @returns A Channel instance
     */
    static fromJson(content: ChannelJson, guildSet: Map<string, Guild> = new Map<string, Guild>()): Channel {
        let guild = null;
        if (guildSet && guildSet.has(content.guild_id)) {
            guild = guildSet.get(content.guild_id);
        }
        let members : Member[] = [];
        if (guild) {
            members = guild.memberList;
        }
        return new Channel(content.id, content.name, content.type, guild, members);
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