import type Guild from "./Guild";
import User from "./User";

/**
 * Platform-specific member of a guild
 * 
 * Contains it's guild specific display name (nickname), and the time of join (UNIX based)
 */
export default class Member {
    user: User;
    guild: Guild;
    #nickname: string | null;
    get nickname():string{
        return this.#nickname??this.user.displayName;
    }
    joinedAt: Date;

    constructor(user: User, guild: Guild, nickname: string, joinedAt: number) {
        this.user = user;
        this.guild = guild;
        this.#nickname = nickname;
        this.joinedAt = new Date(joinedAt * 1000);
    }

    equals(right: User | Member) {
        return (right instanceof User
            && this.user.id === right.id
            && this.user.username === right.username
            && this.user.displayName == right.displayName)
            || (right instanceof Member
                && this.user.id === right.user.id
                && this.user.username === right.user.username
                && this.user.displayName == right.user.displayName);
    }

    static fromJson(content:
        any | {
            "user":
            { "username": string, "display_name": string, "id": string },
            "guild_id": string,
            "nickname": string,
            "joined_at": number
        }): Member {
        return new Member(new User(content.id, content.display_name, content.username), content.guild_id, content.nickname, content.joined_at);
    }
}