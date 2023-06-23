import type Guild from "$lib/classes/Guild"
import { guilds } from "$lib/stores/guilds"
import { derived } from "svelte/store"

export function load({ params }){
    //return derived<Guild>(guilds,);
    guilds.subscribe((value: Guild[]) =>{return value.find(guild=>guild.id == params.guild)})
}