import { KiwiClient } from '@/client';
import { ButtonBuilder, ButtonStyle, User } from 'discord.js';

import { Config } from './configOptions';

import { ConfigEnableButton } from '../buttons/configEnable';
import { ModuleInfoButton } from '../buttons/moduleInfo';
import { ConfigDisableButton } from '../buttons/configDisable';

export const createOverviewButtons = (
	client: KiwiClient,
	config: Config
): ButtonBuilder[] => {
	return [
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ConfigEnableButton.customId,
					moduleId: config.moduleId,
					optionId: config.optionId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Enable Module')
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId(
				client.createCustomId({
					customId: ConfigDisableButton.customId,
					moduleId: config.moduleId,
					optionId: config.optionId,
					ownerId: config.pageOwner.id,
				})
			)
			.setLabel('Disable Module')
			.setStyle(ButtonStyle.Danger),
	];
};
