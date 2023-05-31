import {writable} from "svelte/store";
import User from "$lib/classes/User";
import { goto } from "$app/navigation";

let initToken = ""
if (typeof localStorage !== 'undefined') {
    initToken = localStorage.getItem("auth-token")
}

export const token = writable(initToken);




export enum UserState {
    Present,
    Loading,
    Error
}

export const user = writable({
    user: new User("_", "user", "user"),
    state: UserState.Error
});

export const getUser = async (token: string) => {
    if (!document){
        console.error("getUser accessed from server scope!");
        return;
    }
    user.update(old => ({ user: old.user, state: UserState.Loading }))
    try {
        user.set({ user: User.fromLocalStorage(), state: UserState.Present });
    } catch {
        try {
            User.fromServer(token).then(fetchedUser => {
                if (fetchedUser instanceof User) {
                    user.set({ user: fetchedUser as User, state: UserState.Present });
                }
                else {
                    throw fetchedUser;
                }
            });
        } catch {
            user.update(old => ({ user: old.user, state: UserState.Error }));
            throw goto("/login");
        }
    }
}