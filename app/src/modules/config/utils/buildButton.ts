import { KiwiClient } from '@/client';
import { ButtonBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord.js';
import { ConfigButton } from '../buttons/configButton';

interface ButtonConfig {
	module: string;
	option: string;
	ownerId: string;
	value: string;
	label: string;
	style?: ButtonStyle;
	disabled?: boolean;
}

export const buildButton = (
	client: KiwiClient,
	config: ButtonConfig
): ButtonBuilder => {
	var button = new ButtonBuilder();

	button.setCustomId(
		client.createCustomId({
			customId: ConfigButton.customId,
			module: config.module,
			option: config.option,
			ownerId: config.ownerId,
			value: config.value,
		})
	);

	if (config.label) button.setLabel(config.label);
	if (config.style) button.setStyle(config.style);
	else button.setStyle(ButtonStyle.Primary);
	if (config.disabled) button.setDisabled(true);

	return button;
};
