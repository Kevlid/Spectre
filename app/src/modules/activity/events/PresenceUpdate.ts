import { Presence } from 'discord.js';
import { KiwiClient } from '../../../client';
import { Event, EventList } from '../../../types/event';

/**
 * @type {Event}
 */
export const PresenceUpdate: Event = {
	name: EventList.PresenceUpdate,

	/**
	 * @param {KiwiClient} client
	 * @param {VoiceState} oldVoiceState
	 */
	async getGuildId(presence: Presence) {
		return presence.guild.id;
	},

	/**
	 * @param {KiwiClient} client
	 */
	async execute(client: KiwiClient, presence: Presence) {
		if (presence.member.user.bot) return;

		console.log(presence.status);
		console.log(presence.activities);
	},
};
