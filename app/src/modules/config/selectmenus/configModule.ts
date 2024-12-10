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
export const ConfigModuleSelectMenu: SelectMenu = {
	customId: 'config-module',
	execute: async (
		interaction: StringSelectMenuInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		var page = await getPage(client, {
			guildId: interaction.guildId,
			module: interaction.values[0],
			option: 'overview',
			pageOwner: interaction.user,
		});

		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
