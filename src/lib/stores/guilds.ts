import { writable } from "svelte/store";
import User from "$lib/classes/User";
import type Guild from "$lib/classes/Guild";

export const guilds = writable<Guild[]>([]);
