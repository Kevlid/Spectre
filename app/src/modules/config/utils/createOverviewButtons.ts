import { KiwiClient } from '@/client';
import { ButtonBuilder, ButtonStyle, User } from 'discord.js';

import { Config } from './optionPages';

import { ConfigToggleButton } from '../buttons/configToggle';
import { ModuleInfoButton } from '../buttons/moduleInfo';
import { ConfigCancelButton } from '../buttons/configCancel';

export const createOverviewButtons = (
	client: KiwiClient,
	config: Config
): ButtonBuilder[] => {
	return [
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ConfigToggleButton.customId,
					moduleId: config.moduleId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Toggle Module')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ModuleInfoButton.customId,
					moduleId: config.moduleId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Information')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ConfigCancelButton.customId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger),
	];
};
