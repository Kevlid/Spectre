import { KiwiClient } from '@/client';
import { ButtonBuilder, User } from 'discord.js';

import { Config } from './optionPages';

import { ConfigToggleButton } from '../buttons/configToggle';
import { ModuleInfoButton } from '../buttons/moduleInfo';
import { ConfigCancelButton } from '../buttons/configCancel';

export const createOverviewButtons = (
	client: KiwiClient,
	config: Config
): ButtonBuilder[] => {
	var moduleToggleButton = ConfigToggleButton.config as ButtonBuilder;
	var moduleInfoButton = ModuleInfoButton.config as ButtonBuilder;
	var configCancelButton = ConfigCancelButton.config as ButtonBuilder;

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
			.setStyle(moduleToggleButton.data.style),
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ModuleInfoButton.customId,
					moduleId: config.moduleId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Information')
			.setStyle(moduleInfoButton.data.style),
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ConfigCancelButton.customId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Cancel')
			.setStyle(configCancelButton.data.style),
	];
};
