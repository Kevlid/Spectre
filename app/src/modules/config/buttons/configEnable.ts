import { ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';
import { KiwiClient } from '@/client';
import { Button, CustomOptions } from '@/types/component';

import { getPage } from '../utils/getPage';
import { configOptions } from '../utils/configOptions';

/**
 * @type {Button}
 */
export const ConfigEnableButton: Button = {
	customId: 'config-enable',
	execute: async (
		interaction: ButtonInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		console.log(options);
		await configOptions.pages
			.find(
				(page) =>
					page.moduleId === options.moduleId &&
					page.optionId === options.optionId
			)
			.updateOption(client, interaction.guildId, ['true']);

		var page = await getPage(client, {
			guildId: interaction.guildId,
			moduleId: options.moduleId,
			pageOwner: interaction.user,
		});
		interaction.update({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
