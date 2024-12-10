import { ConfigOptionTypes, PrefixCommand } from '@/types/command';

import { Role } from 'discord.js';

export const RandomColorPrefix: PrefixCommand = {
	config: {
		name: 'random-color',
		description: 'Sets a role to a random color',
		aliases: ['randomcolor'],
		options: [
			{
				name: 'role',
				type: ConfigOptionTypes.ROLE,
			},
		],
	},
	async execute(client, message, commandOptions, role: Role) {
		await role.setColor(Math.floor(Math.random() * 16777215));
		message.reply({
			content: `<@&${role.id}> has been set to a random color`,
			allowedMentions: { parse: [] },
		});
	},
};
