import { KiwiClient } from '@/client';
import { ChannelSelectMenuBuilder, ChannelType } from 'discord.js';
import { ConfigChannelSelectMenu } from '../selectmenus/configChannel';

interface SelectMenuConfig {
	moduleId: string;
	optionId: string;
	ownerId: string;
	maxValues?: number;
	channelTypes?: ChannelType[];
	defaultChannels?: string[];
}

export const buildChannelSelectMenu = (
	client: KiwiClient,
	config: SelectMenuConfig
): ChannelSelectMenuBuilder => {
	var SelectMenu = new ChannelSelectMenuBuilder();

	SelectMenu.setCustomId(
		client.createCustomId({
			customId: ConfigChannelSelectMenu.customId,
			moduleId: config.moduleId,
			optionId: config.optionId,
			ownerId: config.ownerId,
		})
	);

	SelectMenu.setPlaceholder('Select a channel');

	SelectMenu.setMinValues(0);
	if (config.maxValues) {
		SelectMenu.setMaxValues(config.maxValues);
	} else {
		SelectMenu.setMaxValues(1);
	}

	if (config.channelTypes) {
		SelectMenu.setChannelTypes(config.channelTypes);
	} else {
		SelectMenu.setChannelTypes([ChannelType.GuildText]);
	}

	if (config.defaultChannels && config.defaultChannels[0]) {
		SelectMenu.setDefaultChannels(config.defaultChannels);
	}

	return SelectMenu;
};
