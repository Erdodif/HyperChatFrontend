import type Guild from "./Guild";
import User, { type UserJson } from "./User";

export type MemberJson = {
    user: UserJson,
    guild_id: string,
    nickname: string,
    joined_at: number
};

/**
 * Platform-specific member of a guild
 * 
 * Contains it's guild specific display name (nickname), and the time of join (UNIX based)
 */
export default class Member {
    user: User;
    guild: Guild;
    #nickname: string | null;
    get nickname(): string {
        return this.#nickname ?? this.user.displayName;
    }

    get id():string{
        return this.user.id;
    }
    joinedAt: Date;

    constructor(user: User, nickname: string, joinedAt: number, guild: Guild = null) {
        this.user = user;
        this.guild = guild;
        this.#nickname = nickname;
        this.joinedAt = new Date(joinedAt * 1000);
    }

    equals(right: User | Member) {
        return (right instanceof User
            && this.user.id === right.id
            && this.user.username === right.username
            && this.user.displayName == right.displayName
            && this.user.avatarHash == right.avatarHash)
            || (right instanceof Member
                && this.user.id === right.user.id
                && this.user.username === right.user.username
                && this.user.displayName == right.user.displayName
                && this.user.avatarHash == right.user.avatarHash);
    }

    /**
     * Creates Member instance from from raw json.
     * 
     * The guild property will remain unset, if the guildSet reference is not present, or cannot be found.
     * @param content The given Json Object
     * @returns A Member instance
     */
    static fromJson(content: any | MemberJson, guildSet: Map<string, Guild> = null): Member {
        let guild = null;
        if (guildSet && guildSet.has(content.guild_id)) {
            guild = guildSet.get(content.guild_id);
        }
        return new Member(User.fromJson(content.user), content.nickname, content.joined_at, guild);
    }

    copyWithGuild(guild: Guild): Member {
        return new Member(this.user, this.#nickname, this.joinedAt.getMilliseconds(), guild);
    }
}