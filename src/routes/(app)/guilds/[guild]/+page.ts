import { error } from '@sveltejs/kit';
import { guilds } from '$lib/stores/guilds.js';

export function load({ params }) {
    if (guilds.has(params.guild)) {
        return {guild:guilds.get(params.guild)};
    }
    //throw error(404, 'Not found');
}