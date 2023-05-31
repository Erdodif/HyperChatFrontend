import { PUBLIC_SERVER_URL } from "$env/static/public";

export default class User {
    username: string;
    displayName: string;
    id: string;

    constructor(id: string, username: string, display_name: string) {
        this.id = id;
        this.username = username;
        this.displayName = display_name;
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

    static fromJson(content: any | { "username": string, "display_name": string, "id": string }) {
        if (!content.username || !content.display_name || !content.id) {
            return new Error("Cannot construct user from json!");
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

    static clearStorage(){
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("display_name");
    }

    static async fromServer(token: string): Promise<User | Error> {
        return User.fromJson(await (await fetch(PUBLIC_SERVER_URL + "/users/\@self", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })).json());
    }
}