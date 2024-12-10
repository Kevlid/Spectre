import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { KiwiClient } from '@/client';
import { Button, CustomOptions } from '@/types/component';

import { getPage } from '../utils/getPage';
import { configOptions } from '../utils/configOptions';

/**
 * @type {Button}
 */
export const ConfigButton: Button = {
	customId: 'config-button',
	execute: async (
		interaction: ButtonInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		await configOptions.pages
			.find(
				(page) =>
					page.module === options.module &&
					page.option === options.option
			)
			.updateOption(client, interaction.guildId, [options.value]);

		var page = await getPage(client, {
			guildId: interaction.guildId,
			module: options.module,
			option: options.option,
			pageOwner: interaction.user,
		});
		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
