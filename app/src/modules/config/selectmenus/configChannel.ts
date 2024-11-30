import {
	ChannelSelectMenuBuilder,
	ChannelSelectMenuInteraction,
	ChannelType,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { CustomOptions, SelectMenu } from '@/types/component';

import { configOptions } from '../utils/configOptions';
import { getPage } from '../utils/getPage';

/**
 * @type {SelectMenu}
 */
export const ConfigChannelSelectMenu: SelectMenu = {
	customId: 'config-channel',
	execute: async (
		interaction: ChannelSelectMenuInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		await configOptions.pages
			.find(
				(page) =>
					page.moduleId === options.moduleId &&
					page.optionId === options.optionId
			)
			.updateOption(
				client,
				interaction.guildId,
				interaction.values || [null]
			);

		var page = await getPage(client, {
			guildId: interaction.guildId,
			moduleId: options.moduleId,
			optionId: options.optionId,
			pageOwner: interaction.user,
		});

		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
