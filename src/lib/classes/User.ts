import { PUBLIC_SERVER_URL } from "$env/static/public";
import { goto } from "$app/navigation";
import { page } from "$app/stores";

export enum UserStatus {
    UNKNOWN,
    ONLINE,
    AWAY
}

export default class User {
    username: string;
    displayName: string;
    id: string;
    status: UserStatus;

    constructor(id: string, username: string, display_name: string) {
        this.id = id;
        this.username = username;
        this.displayName = display_name;
        this.status = UserStatus.UNKNOWN;
    }

    equals(right: User) {
        return typeof this === typeof right
            && this.id === right.id
            && this.username === right.username
            && this.displayName == right.displayName;
    }

    toLocalStorage() {
        localStorage.setItem("user_name", this.username);
        localStorage.setItem("display_name", this.displayName);
        localStorage.setItem("user_id", this.id);
    }

    static fromJson(content: any | { "username": string, "display_name": string, "id": string }, from: string = "/"): User {
        if (!content.username || !content.display_name || !content.id) {
            let login = new URL("/login");
            if (from !== "/") {
                login.searchParams.append("from", from);
            }
            goto(login);
        }
        return new User(content.id, content.display_name, content.username);
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
        return this.fromServer(token, "@self")
    }

    static async fromServer(token: string, id: "@self" | string) {
        return User.fromJson(await (await fetch(PUBLIC_SERVER_URL + `/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })).json());
    }
}