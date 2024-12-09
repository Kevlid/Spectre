import { Guild, Message } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { createVoiceState } from '../utils/createVoiceState';
import { getVoiceState } from '../utils/getVoiceState';
import { updateVoiceState } from '../utils/updateVoiceState';
import { saveVoice } from '../utils/saveVoice';
import { removeVoiceState } from '../utils/removeVoiceState';

export const GuildReady: Event = {
	name: EventList.GuildReady,

	async getGuildId(guild: Guild) {
		return guild.id;
	},

	async execute(client: KiwiClient, guild: Guild) {
		for (var voiceState of guild.voiceStates.cache.values()) {
			var userVoiceState = await getVoiceState(
				client,
				guild.id,
				voiceState.member.id
			);
			if (!userVoiceState) {
				await createVoiceState(client, guild.id, voiceState.id);
			} else {
				var secondsSinceLastUpdate =
					(new Date().getTime() -
						userVoiceState.lastUpdate.getTime()) /
					1000;
				if (secondsSinceLastUpdate < 2 * 60 * 60) {
					await updateVoiceState(
						client,
						guild.id,
						userVoiceState.userId
					);
					await saveVoice(
						client,
						guild.id,
						userVoiceState.userId,
						voiceState.member.user.username,
						secondsSinceLastUpdate
					);
				} else {
					await removeVoiceState(client, guild.id, voiceState.id);
				}
			}
		}

		var voiceStates = await client.db.repos.activityVoicestates.findBy({
			guildId: guild.id,
		});
		for (var vs of voiceStates) {
			if (!guild.voiceStates.cache.has(vs.userId)) {
				await client.db.repos.activityVoicestates.delete({
					guildId: guild.id,
					userId: vs.userId,
				});
			}
		}
	},
};
