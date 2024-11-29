import { KiwiClient } from '@/client';
import { ChannelType, RoleSelectMenuBuilder } from 'discord.js';
import { ConfigChannelSelectMenu } from '../selectmenus/configChannel';

interface SelectMenuConfig {
	moduleId: string;
	optionId: string;
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
			moduleId: config.moduleId,
			optionId: config.optionId,
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
