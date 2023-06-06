import { writable } from "svelte/store";
import type User from "$lib/classes/User";
import { goto } from "$app/navigation";

let initToken = ""
if (typeof localStorage !== 'undefined') {
    initToken = localStorage.getItem("auth-token");
}

export const token = writable(initToken);

export enum UserState {
    Present,
    Loading,
    Error
}

export const user = writable<User>(null);