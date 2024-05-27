import { goto } from "$app/navigation";
import Rest from "./Rest";
import Member from "./Member";

export type UserJson = { username: string, display_name: string, id: string };

export enum UserStatus {
    ONLINE,
    IDLE,
    BUSY,
    OFFLINE
}

export default class User {
    username: string;
    private _displayName: string;
    get hasDisplayName() : boolean{
        return this._displayName !== null  && this._displayName !== undefined;
    }
    get displayName(): string {
        if (!this._displayName) {
            return this.username;
        }
        return this._displayName;
    }
    readonly id: string;
    status: UserStatus;

    constructor(id: string, username: string, display_name: string) {
        this.id = id;
        this.username = username;
        this._displayName = display_name;
        this.status = UserStatus.OFFLINE;
    }

    equals(right: User | Member) {
        return (right instanceof User
            && this.id === right.id
            && this.username === right.username
            && this.displayName == right.displayName)
            || (right instanceof Member
                && this.id === right.user.id
                && this.username === right.user.username
                && this.displayName == right.user.displayName);
    }

    toLocalStorage() {
        localStorage.setItem("user_name", this.username);
        localStorage.setItem("display_name", this.displayName);
        localStorage.setItem("user_id", this.id);
    }

    static fromJsonOrRedirect(content: any | UserJson, from: string = "/"): User {
        if (!content.username && !content.display_name && !content.id) {
            let login = new URL("/login");
            if (from !== "/") {
                login.searchParams.append("from", from);
            }
            goto(login);
        }
        return new User(content.id, content.username, content.display_name);
    }

    static fromJson(content: any | UserJson): User {
        return new User(content.id, content.username, content.display_name);
    }

    static fromLocalStorage(): User {
        if (!(localStorage.getItem("user_id")
            && localStorage.getItem("username")
            && localStorage.getItem("display_name"))) {
            throw new Error("Local user does not exist!");
        }
        return new User(
            localStorage.getItem("user_id"),
            localStorage.getItem("username"),
            localStorage.getItem("display_name"));
    }

    static clearStorage() {
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("display_name");
    }

    static async selfFromServer(token: string): Promise<User | Error> {
        return this.fromServer("@self");
    }

    static async fromServer(id: "@self" | string) {
        return User.fromJsonOrRedirect((await Rest.getJsonFromServer(`users/${id}`)));
    }
}