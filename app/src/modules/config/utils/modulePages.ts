import { KiwiClient } from '@/client';
import {
	ActionRowBuilder,
	EmbedBuilder,
	Guild,
	StringSelectMenuBuilder,
	User,
} from 'discord.js';

import { optionPages, Config } from './optionPages';

import { ConfigModuleSelectMenu as ConfigModuleSM } from '../selectmenus/configModule';
import { ConfigOptionSelectMenu as ConfigOptionSM } from '../selectmenus/configOption';

export async function getPage(client: KiwiClient, config: Config) {
	config = await optionPages.setupConfig(client, config);

	var pageData = await optionPages.pages
		.find((page) => page.moduleId === config.moduleId && !page.optionId)
		.execute(client, config);

	var description = Array.isArray(pageData.description)
		? pageData.description.join('\n')
		: pageData.description;

	var em = new EmbedBuilder()
		.setColor(client.Settings.color)
		.setTitle('Server Configuration')
		.setThumbnail(config.guild.iconURL())
		.setFooter({
			text: `Requested by ${client.capitalize(
				config.pageOwner.username
			)}`,
			iconURL: config.pageOwner.displayAvatarURL(),
		})
		.setDescription(description);

	var allModules = optionPages.pages
		.map((page) => page.moduleId)
		.filter((moduleId, index, self) => self.indexOf(moduleId) === index);
	console.log(allModules);

	var configModuleSM = new StringSelectMenuBuilder()
		.setCustomId(
			client.createCustomId({
				customId: ConfigModuleSM.customId,
				ownerId: config.pageOwner.id,
			})
		)
		.setPlaceholder('Select a module')
		.addOptions(
			allModules.map((moduleId) => {
				return {
					label: client.capitalize(moduleId),
					value: moduleId,
				};
			})
		);

	for (var option of configModuleSM.options) {
		if (config.moduleId === option.data.value) {
			option.data.default = true;
		}
	}

	var allOptions = optionPages.pages.filter(
		(page) => page.moduleId === config.moduleId && page.optionId
	);

	var configOptionSM = new StringSelectMenuBuilder()
		.setCustomId(
			client.createCustomId({
				customId: ConfigOptionSM.customId,
				moduleId: config.moduleId,
				ownerId: config.pageOwner.id,
			})
		)
		.setPlaceholder('Select an option')
		.addOptions(
			allOptions.map((page) => {
				return {
					label: client.capitalize(page.optionId),
					value: page.optionId,
				};
			})
		);

	if (!config.optionId && allOptions.length > 0) {
		config.optionId = allOptions[0].optionId;
	}

	for (var option of configOptionSM.options) {
		if (config.optionId === option.data.value) {
			option.data.default = true;
		}
	}

	return {
		embeds: [em],
		rows: [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				configModuleSM
			),
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				configOptionSM
			),
		],
	};
}
