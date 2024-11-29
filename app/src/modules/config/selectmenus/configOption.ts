import {
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	StringSelectMenuInteraction,
} from 'discord.js';
import { KiwiClient } from '@/client';

import { CustomOptions, SelectMenu } from '@/types/component';
import { getPage } from '../utils/getPage';

/**
 * @type {SelectMenu}
 */
export const ConfigOptionSelectMenu: SelectMenu = {
	customId: 'config-option',
	execute: async (
		interaction: StringSelectMenuInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		console.log(interaction.values[0], options.moduleId);
		var page = await getPage(client, {
			guildId: interaction.guildId,
			moduleId: options.moduleId,
			optionId: interaction.values[0],
			pageOwner: interaction.user,
		});

		console.log('kkk');

		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
