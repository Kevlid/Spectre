import { RecurrenceRule } from 'node-schedule';
import { Schedule } from '@/types/schedule';
import { KiwiClient } from '@/client';

import { updateVoiceState } from '../utils/updateVoiceState';
import { saveVoice } from '../utils/saveVoice';
import { getVoiceState } from '../utils/getVoiceState';

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.minute = 0;

export const hourlySchedule: Schedule = {
	rule: timeRule,
	execute: async (client: KiwiClient, guildId: string) => {
		var guild = await client.guilds.fetch(guildId);
		var voiceStates = await guild.voiceStates.cache.values();
		for (var voiceState of voiceStates) {
			var userVoiceState = await getVoiceState(
				client,
				guildId,
				voiceState.member.id
			);
			if (!userVoiceState) continue;

			var secondsSinceLastUpdate =
				(new Date().getTime() - userVoiceState.lastUpdate.getTime()) /
				1000;
			await updateVoiceState(client, guildId, userVoiceState.userId);

			var member = await guild.members.fetch(userVoiceState.userId);
			await saveVoice(
				client,
				guildId,
				userVoiceState.userId,
				member.user.username,
				secondsSinceLastUpdate
			);
		}
	},
};
