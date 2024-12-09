import { env } from '@/env';
import { PrefixCommand } from '@/types/command';

import {
	GuildMember,
	GuildTextBasedChannel,
	TextChannel,
	User,
} from 'discord.js';

export const RestartPrefix: PrefixCommand = {
	config: {
		name: 'restart',
		description: 'Restarts the whole service',
		aliases: ['reboot'],
	},
	async execute(client, message, commandOptions) {
		await message.reply('Restarting...');

		// Save all voice data
		var voiceStates = await client.db.repos.activityVoicestates.find();
		for (var voiceState of voiceStates) {
			var seconds =
				(new Date().getTime() - voiceState.lastUpdate.getTime()) / 1000;
			await client.db.repos.activityVoicestates.delete({
				guildId: voiceState.guildId,
				userId: voiceState.userId,
			});

			var userVoice = await client.db.repos.activityVoice.findOneBy({
				guildId: voiceState.guildId,
				userId: voiceState.userId,
			});
			var user = await client.users.fetch(voiceState.userId);

			if (!userVoice) {
				await client.db.repos.activityVoice.insert({
					guildId: voiceState.guildId,
					userId: voiceState.userId,
					userName: user.username,
					totalSeconds: seconds,
					dailySeconds: seconds,
					weeklySeconds: seconds,
					monthlySeconds: seconds,
				});
			} else {
				await client.db.repos.activityVoice.update(
					{
						guildId: voiceState.guildId,
						userId: voiceState.userId,
					},
					{
						userName: user.username,
						totalSeconds: userVoice.totalSeconds + seconds,
						dailySeconds: userVoice.dailySeconds + seconds,
						weeklySeconds: userVoice.weeklySeconds + seconds,
						monthlySeconds: userVoice.monthlySeconds + seconds,
					}
				);
			}
		}

		if (env.RESTART_WEBHOOK_URL) {
			fetch(env.RESTART_WEBHOOK_URL);
		} else {
			message.reply('Restart webhook URL not set');
		}
	},
};
