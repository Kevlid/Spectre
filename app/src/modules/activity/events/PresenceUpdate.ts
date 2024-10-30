import { Presence } from 'discord.js';
import { KiwiClient } from '../../../client';
import { Event, EventList } from '../../../types/event';

/**
 * @type {Event}
 */
export const PresenceUpdate: Event = {
	name: EventList.PresenceUpdate,
	global: true,

	/**
	 * @param {KiwiClient} client
	 */
	async execute(client: KiwiClient, presence: Presence) {
		if (presence.member.user.bot) return;

		console.log(
			presence.user.username,
			(await presence.member.fetch()).presence.status
		); // online, idle, dnd, offline
		console.log(presence.activities); // [Activity]
	},
};
