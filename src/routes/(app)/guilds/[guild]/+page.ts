import type Guild from "$lib/classes/Guild"
import { guildSet } from "$lib/stores/guildSet"
import { derived } from "svelte/store"
import { error } from "@sveltejs/kit"

export function load({ params }) {
    //return derived<Guild>(guilds,);
    let guild:Guild;
    let unsubscribe = guildSet.subscribe((guildSet)=>guild = guildSet.guilds.get(params.guild));
    if (guild) {
        return { guild };
    }
    unsubscribe();
    throw error(404,'Guild not found');
}