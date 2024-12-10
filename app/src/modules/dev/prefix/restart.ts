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

		if (env.RESTART_WEBHOOK_URL) {
			fetch(env.RESTART_WEBHOOK_URL);
		} else {
			message.reply('Restart webhook URL not set');
		}
	},
};
