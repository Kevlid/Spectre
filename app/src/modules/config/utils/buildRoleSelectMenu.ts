import { KiwiClient } from '@/client';
import { ChannelType, RoleSelectMenuBuilder } from 'discord.js';
import { ConfigChannelSelectMenu } from '../selectmenus/configChannel';

interface SelectMenuConfig {
	module: string;
	option: string;
	ownerId: string;
	maxValues?: number;
	defaultRoles?: string[];
}

export const buildRoleSelectMenu = (
	client: KiwiClient,
	config: SelectMenuConfig
): RoleSelectMenuBuilder => {
	var SelectMenu = new RoleSelectMenuBuilder();

	SelectMenu.setCustomId(
		client.createCustomId({
			customId: ConfigChannelSelectMenu.customId,
			module: config.module,
			option: config.option,
			ownerId: config.ownerId,
		})
	);

	SelectMenu.setPlaceholder('Select a role');

	SelectMenu.setMinValues(0);
	if (config.maxValues) {
		SelectMenu.setMaxValues(config.maxValues);
	} else {
		SelectMenu.setMaxValues(1);
	}

	if (config.defaultRoles && config.defaultRoles[0]) {
		SelectMenu.setDefaultRoles(config.defaultRoles);
	}

	return SelectMenu;
};
