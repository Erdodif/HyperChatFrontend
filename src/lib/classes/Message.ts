import type { AttachmentJson } from "./Attachment";
import Attachment from "./Attachment";
import type Channel from "./Channel";
import Member, { type MemberJson } from "./Member";
import User, { type UserJson } from "./User";

export const EPOCH: bigint = 1672531200000n // 2023-01-01T00:00:00Z in milis

export type ChatMessageJson = { author: MemberJson | UserJson, content: string, id: string, attachments: AttachmentJson[] }

export abstract class Message {

    id: string;
    channel: Channel;
    content: string;
    created: Date;

    constructor(id: string, content: string, channel: Channel | null = null) {
        this.id = id;
        this.content = content;
        this.channel = channel;
        this.created = new Date(Date.now());
    }

    equals(right: Message): boolean {
        return typeof this === typeof right && this.content == right.content;
    }

    /**
     * Returns the time difference in seconds
     * @param other The other message object to compare
     * @returns Time in seconds
     */
    secondsBetween(other: Message): number {
        return Math.round((this.created.valueOf() - other.created.valueOf()) / 1000);
    }

    sameContent(other: Message): boolean {
        return this.content === other.content;
    }
}

export class ChatMessage extends Message {

    attachments: Attachment[];
    author: User | Member;

    get from(): string {
        if (this.author instanceof User) {
            return this.author.id;
        }
        return this.author.user.id;
    }

    constructor(author: User | Member, content: string, id: string, channel: Channel | null = null, attachments: Attachment[] = []) {
        super(id, content, channel);
        this.author = author;
        this.created = new Date(Number((BigInt(id) >> 22n) + EPOCH));
        this.attachments = attachments;
        for (const attachment of attachments) {
            attachment.message = this;
        }
    }

    equals(right: Message): boolean {
        return typeof this === typeof right
            && this.id === (right as ChatMessage).id;
    }

    static fromJson(data: ChatMessageJson, channel: Channel | null = null): ChatMessage {
        let author: User | Member;
        if ((data.author as UserJson).id) {
            author = User.fromJson(data.author);
        } else {
            author = Member.fromJson(data.author);
        }
        let attachments = [];
        for (const attachment of data.attachments) {
            attachments.push(Attachment.fromJson(attachment));
        }
        return new ChatMessage(author, data.content, data.id, channel, attachments);
    }

    sameAuthor(other: ChatMessage): boolean {
        return this.author.id === other.author.id;
    }
}

export class UnsentMessage extends ChatMessage {

    nonce: string;

    constructor(author: User | Member, content: string, nonce: string, channel: Channel = null, attachments: Attachment[] = []) {
        super(author, content, Date.now().toString(), channel, attachments);
        this.nonce = nonce;
    }

    equals(right: Message): boolean {
        return typeof this === typeof right
            && this.nonce === (right as UnsentMessage).nonce
            && this.content === right.content
            && this.author.equals((right as UnsentMessage).author);
    }
}