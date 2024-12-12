import { StringSelectMenuInteraction } from 'discord.js';
import { KiwiClient } from '@/client';
import { CustomOptions, SelectMenu } from '@/types/component';

import { buildPendingMessage } from '../utils/buildPendingMessage';

export const VerifyRoleSelectMenu: SelectMenu = {
	customId: 'verify-role',
	async execute(
		interaction: StringSelectMenuInteraction,
		options: CustomOptions,
		client: KiwiClient
	) {
		var member = await interaction.guild.members.fetch(options.memberId);
		var { embeds, components } = await buildPendingMessage(
			client,
			interaction.guild,
			member,
			interaction.values[0]
		);
		interaction.update({
			embeds: [...embeds],
			components: [...components],
		});
	},
};
