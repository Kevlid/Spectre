import { VoiceState } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { createVoiceState } from '../utils/createVoiceState';
import { removeVoiceState } from '../utils/removeVoiceState';
import { saveVoice } from '../utils/saveVoice';
import { getVoiceState } from '../utils/getVoiceState';

/**
 * @type {Event}
 */
export const VoiceStateUpdate: Event = {
	name: EventList.VoiceStateUpdate,

	/**
	 * @param {KiwiClient} client
	 * @param {VoiceState} oldVoiceState
	 */
	async getGuildId(voiceState: VoiceState) {
		return voiceState.guild.id;
	},

	/**
	 * @param {KiwiClient} client
	 * @param {VoiceState} oldVoiceState
	 * @param {VoiceState} newVoiceState
	 */
	async execute(
		client: KiwiClient,
		oldVoiceState: VoiceState,
		newVoiceState: VoiceState
	) {
		if (newVoiceState.member.user.bot) return;

		var userVoiceState = await getVoiceState(
			client,
			newVoiceState.guild.id,
			newVoiceState.id
		);

		if (userVoiceState && !newVoiceState.channelId) {
			// User left voice channel
			await removeVoiceState(
				client,
				newVoiceState.guild.id,
				newVoiceState.id
			);

			var secondsSinceLastUpdate =
				(new Date().getTime() - userVoiceState.lastUpdate.getTime()) /
				1000;
			await saveVoice(
				client,
				newVoiceState.guild.id,
				newVoiceState.id,
				newVoiceState.member.user.username,
				secondsSinceLastUpdate
			);
		} else if (!oldVoiceState.channelId && newVoiceState.channelId) {
			// User joined a voice channel
			await createVoiceState(
				client,
				newVoiceState.guild.id,
				newVoiceState.id
			);
		}
	},
};
