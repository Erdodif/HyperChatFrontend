import ChatLog from "./ChatLog";
import User from "./User";

export default class Guild {
    readonly id: string;
    readonly name: string;
    readonly ownerId: string;
    members: User[];
    channels: Channel[];

    constructor(id: string, name: string, ownerId: string, chanels: Channel[] = [], members: User[] = []) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.channels = chanels;
        this.members = members;
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
    users: User[];
    chat: ChatLog;

    constructor(id: string, name: string, type: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.users = [];
        this.chat = new ChatLog();
    }
}