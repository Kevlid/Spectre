import { PrefixCommand, ConfigOptionTypes } from '@/types/command';

import { checkPermissions } from '../utils/checkPermissions';
import { GuildMember, TextChannel } from 'discord.js';

/**
 * @type {PrefixCommand}
 */
export const TimeoutPrefix: PrefixCommand = {
	config: {
		name: 'timeout',
		description: 'Timeout a user',
		aliases: ['time', 't'],
		autoDelete: true,
		options: [
			{
				name: 'member',
				type: ConfigOptionTypes.MEMBER,
			},
			{
				name: 'time',
				type: ConfigOptionTypes.NUMBER,
				maxValue: 39999,
			},
		],
	},
	async checks(client, message, commandOptions) {
		return await checkPermissions(
			client,
			message.guildId,
			message.author.id
		);
	},
	async execute(
		client,
		message,
		commandOptions,
		member: GuildMember,
		time: number
	) {
		if (member.user.bot) {
			var channel = message.channel as TextChannel;
			channel.send('I cannot timeout this user');
		} else {
			var minutes = time * 1000 * 60;
			member.timeout(minutes);
		}
	},
};
