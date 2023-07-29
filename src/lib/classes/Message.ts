import Member, { type MemberJson } from "./Member";
import User, { type UserJson } from "./User";

export const EPOCH: bigint = 1672531200000n // 2023-01-01T00:00:00Z in milis

export type ChatMessageJson = { author: MemberJson | UserJson, content: string, id: string }

export class Message {

    content: string;
    created: Date;

    constructor(content: string) {
        this.content = content;
        this.created = new Date(Date.now());
    }

    equals(right: Message): boolean {
        return typeof this === typeof right && this.content == right.content;
    }
}

export class SystemMessage extends Message {

    constructor(content: string) {
        super(content);
    }

    equals(right: Message): boolean {
        return typeof this === typeof right && this.content == right.content;
    }
}

export class ChatMessage extends Message {

    author: User | Member;
    id: string;

    get from():string{
        if(this.author instanceof User){
            return this.author.id;
        }
        return this.author.user.id;
    }

    constructor(author: User | Member, content: string, id: string) {
        super(content)
        this.author = author;
        this.id = id;
        this.created = new Date(Number((BigInt(id) >> 22n) + EPOCH));
    }

    equals(right: Message): boolean {
        return typeof this === typeof right
            && this.id === (right as ChatMessage).id;
    }

    static fromJson(data: ChatMessageJson): ChatMessage {
        let author: User | Member;
        if ((data.author as UserJson).id) {
            author = User.fromJson(data.author);
        } else {
            author = Member.fromJson(data.author);
        }
        return new ChatMessage(author, data.content, data.id);
    }
}

export class UnsentMessage extends Message {

    author: User | Member;
    nonce: string;

    constructor(author: User | Member, content: string, nonce: string) {
        super(content)
        this.author = author;
        this.nonce = nonce;
    }

    messageSent(id: string): ChatMessage {
        return new ChatMessage(this.author, this.content, id);
    }

    equals(right: Message): boolean {
        return typeof this === typeof right
            && this.nonce === (right as UnsentMessage).nonce
            && this.content === right.content
            && this.author.equals((right as UnsentMessage).author);
    }
}