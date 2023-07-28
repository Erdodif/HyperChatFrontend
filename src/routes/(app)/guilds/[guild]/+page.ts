import type Guild from "$lib/classes/Guild"
import { guildSet } from "$lib/stores/guildSet"
import { error } from "@sveltejs/kit"

export function load({ params }) {
    let guild: Guild;
    guildSet.subscribe((guildSet) => guild = guildSet.guilds.get(params.guild))();
    if (guild) {
        return { guild };
    }
    throw error(404, 'guild.missing');
}