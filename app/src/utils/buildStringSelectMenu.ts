import { KiwiClient } from '@/client';
import { StringSelectMenuBuilder, ChannelType } from 'discord.js';

interface SelectMenuConfig {
	customId: string;
	placeholder: string;
	minValues?: number;
	maxValues?: number;
	options: {
		label: string;
		value: string;
		description?: string;
		default?: boolean;
	}[];
	defaults?: string[];
}

export const buildStringSelectMenu = (
	client: KiwiClient,
	config: SelectMenuConfig
): StringSelectMenuBuilder => {
	var SelectMenu = new StringSelectMenuBuilder();

	console.log(config.customId);
	SelectMenu.setCustomId(config.customId);

	SelectMenu.setPlaceholder(config.placeholder);

	if (config.minValues) {
		SelectMenu.setMinValues(config.minValues);
	} else {
		SelectMenu.setMinValues(0);
	}
	if (config.maxValues) {
		SelectMenu.setMaxValues(config.maxValues);
	} else {
		SelectMenu.setMaxValues(1);
	}

	if (config.options) {
		SelectMenu.addOptions(config.options);
	}

	if (config.defaults) {
		for (var option of SelectMenu.options) {
			if (config.defaults.includes(option.data.value)) {
				option.data.default = true;
			}
		}
	}

	return SelectMenu;
};
