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

		var member = await presence.member.fetch();

		await client.db.repos.activityStatus.insert({
			userId: member.id,
			userName: member.user.username,
			status: member.presence.status,
		});
	},
};
