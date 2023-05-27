export default class User {
    username: string;
    display_name: string;
    id: string;

    constructor(id: string, username: string, display_name: string) {
        this.id = id;
        this.username = username;
        this.display_name = display_name;
    }

    equals(right: User) {
        return typeof this === typeof right
            && this.id === right.id
            && this.username === right.username
            && this.display_name == right.display_name;
    }

    static fromLocalStorage(): User | null {
        if (!(localStorage.getItem("user_id")
            && localStorage.getItem("username")
            && localStorage.getItem("display_name"))) {
            return null;
        }
        return new User(
            localStorage.getItem("user_id"),
            localStorage.getItem("username"),
            localStorage.getItem("display_name"));

    }
}