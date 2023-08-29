import type { Message } from "$lib/classes/Message";
export type AttachmentJson = { filename: string, id: number, content_type: string }

export default class Attachment {
    message: Message;
    filename: string;
    contentType: string;
    id: number;

    constructor(filename: string, id: number, contentType: string = "octet/stream", message: Message | null = null) {
        this.filename = filename;
        this.id = id;
        this.contentType = contentType;
        this.message = message;
    }

    get endpoint(): string {
        return `attachments/${this.message.channel.id}/${this.message.id}/${this.id}/${this.filename}`;
    }

    static fromJson(data: AttachmentJson): Attachment {
        return new Attachment(data.filename, data.id, data.content_type);
    }

}