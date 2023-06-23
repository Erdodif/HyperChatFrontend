import { error } from '@sveltejs/kit';
import { channels, guilds } from '$lib/stores/guilds.js';

export function load({ params }) {
    if (channels.get(params.channel)) {
        return { guild: channels.get(params.channel).guild, channel: channels.get(params.channel).channel };
    }
    //throw error(404, 'Not found');
}