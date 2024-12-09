import { PrefixCommand, ConfigOptionTypes } from '@/types/command';

import { checkPermissions } from '../utils/checkPermissions';
import { GuildMember } from 'discord.js';

/**
 * @type {PrefixCommand}
 */
export const VoiceKickPrefix: PrefixCommand = {
	config: {
		name: 'voice-kick',
		description: 'Kick a user from a voice channel',
		aliases: ['voicekick', 'vc-kick', 'vckick'],
		autoDelete: true,
		options: [
			{
				name: 'member',
				type: ConfigOptionTypes.MEMBER,
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
	async execute(client, message, commandOptions, member: GuildMember) {
		member.voice.disconnect();
	},
};
