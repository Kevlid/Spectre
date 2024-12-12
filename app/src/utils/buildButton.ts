import { ButtonBuilder, ButtonStyle } from 'discord.js';

interface ButtonConfig {
	customId?: string;
	label: string;
	style?: ButtonStyle;
	disabled?: boolean;
	url?: string;
}

export const buildButton = (config: ButtonConfig): ButtonBuilder => {
	var button = new ButtonBuilder();

	if (config.customId) button.setCustomId(config.customId);
	if (config.url) button.setURL(config.url);

	if (config.label) button.setLabel(config.label);
	if (config.style) button.setStyle(config.style);
	else button.setStyle(ButtonStyle.Primary);
	if (config.disabled) button.setDisabled(true);

	return button;
};
