import {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	StringSelectMenuInteraction,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { CustomOptions, SelectMenu } from '@/types/component';

import { getActivityPage } from '../utils/getActivityPage';

/**
 * @type {SelectMenu}
 */
export const ActivitySelectMenu: SelectMenu = {
	customId: 'activity-type',
	config: new StringSelectMenuBuilder()
		.setPlaceholder('Select an Activity Type')
		.addOptions(
			new StringSelectMenuOptionBuilder()
				.setLabel('Status Activity')
				.setValue('status'),
			new StringSelectMenuOptionBuilder()
				.setLabel('Presence Activity')
				.setValue('presence'),
			new StringSelectMenuOptionBuilder()
				.setLabel('Voice Activity')
				.setValue('voice'),
			new StringSelectMenuOptionBuilder()
				.setLabel('Message Activity')
				.setValue('message')
		),
	execute: async (
		interaction: StringSelectMenuInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		var page = await getActivityPage(client, {
			guildId: interaction.guildId,
			page: interaction.values[0],
			pageOwner: interaction.user,
			user: await client.users.fetch(options.userId),
		});
		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
