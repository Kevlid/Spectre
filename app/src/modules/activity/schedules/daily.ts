import { RecurrenceRule } from 'node-schedule';
import { TextChannel } from 'discord.js';
import { Schedule } from '@/types/schedule';
import { KiwiClient } from '@/client';

import { getActivityConfig } from '../utils/getActivityConfig';
import { updateVoiceState } from '../utils/updateVoiceState';
import { saveVoice } from '../utils/saveVoice';
import { grantMostActiveRole } from '../utils/grantMostActiveRole';
import { createVoiceLeaderboard } from '../utils/createVoiceLeaderboard';

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.hour = 0;
timeRule.minute = 0;

export const dailySchedule: Schedule = {
	rule: timeRule,
	execute: async (client: KiwiClient, guildId: string) => {
		// Saves everyones voice activity
		var voiceStates = await client.db.repos.activityVoicestates.findBy({
			guildId: guildId,
		});
		for (var userVoiceState of voiceStates) {
			var secondsSinceLastUpdate =
				(new Date().getTime() - userVoiceState.joinedAt.getTime()) /
				1000;
			updateVoiceState(
				client,
				guildId,
				userVoiceState.userId,
				userVoiceState.channelId
			);
			await saveVoice(
				client,
				guildId,
				userVoiceState.userId,
				secondsSinceLastUpdate
			);
		}

		// Grant the most active role to the most active user
		await grantMostActiveRole(client, guildId, 'daily');

		// Sends the leaderboard to the log channel before its reset
		var actConf = await getActivityConfig(client, guildId);
		if (actConf?.logChannel) {
			let lb = await createVoiceLeaderboard(client, guildId, 'daily');
			var channel = client.channels.cache.get(
				actConf.logChannel
			) as TextChannel;
			if (channel) {
				channel.send(lb.content);
			}
		}

		// Updates the daily seconds to 0
		client.db.repos.activityVoice.update(
			{
				guildId: guildId,
			},
			{
				dailySeconds: 0,
			}
		);

		// Updates the daily messages to 0
		client.db.repos.activityMessages.update(
			{
				guildId: guildId,
			},
			{
				dailyMessages: 0,
			}
		);

		// Clean up old status and presence records
		// Remove all records older than 1 month
		// TODO: Test so it works as it should
		var oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		var allStatus = await client.db.repos.activityStatus.find();
		for (let status of allStatus) {
			if (status.timestamp < oneMonthAgo) {
				await client.db.repos.activityStatus.delete(status);
			}
		}

		var allPresence = await client.db.repos.activityPresence.find();
		for (let presence of allPresence) {
			if (presence.startTimestamp < oneMonthAgo) {
				await client.db.repos.activityPresence.delete(presence);
			}
		}
	},
};
