import { writable } from "svelte/store";
import type User from "$lib/classes/User";

let initToken = "";

export function initializeToken() {
    initToken = localStorage.getItem("auth-token")!;
}

if (typeof localStorage !== 'undefined') {
    initializeToken();
}

export const token = writable(initToken);

export enum UserState {
    Present,
    Loading,
    Error
}

export const user = writable<User>();