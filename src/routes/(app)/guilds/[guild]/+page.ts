import type Guild from "$lib/classes/Guild"
import { guilds } from "$lib/stores/guilds"
import { derived } from "svelte/store"
import { error } from "@sveltejs/kit"

export function load({ params }) {
    //return derived<Guild>(guilds,);
    let guild = guilds.get(params.guild);
    if (guild) {
        return { guild };
    }
    throw error(404,'Guild not found');
}