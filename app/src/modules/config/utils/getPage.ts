import { KiwiClient } from '@/client';
import {
	ActionRowBuilder,
	AnyComponentBuilder,
	ChannelSelectMenuBuilder,
	EmbedBuilder,
	Guild,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	User,
	UserSelectMenuBuilder,
} from 'discord.js';

import { configOptions, Config } from './configOptions';

import { ConfigModuleSelectMenu as ConfigModuleSM } from '../selectmenus/configModule';
import { ConfigOptionSelectMenu as ConfigOptionSM } from '../selectmenus/configOption';
import { ButtonBuilder } from '@discordjs/builders';

export async function getPage(client: KiwiClient, config: Config) {
	config = await configOptions.setupConfig(client, config);

	var pageData = await configOptions.pages
		.find(
			(page) =>
				page.module === config.module && page.option === config.option
		)
		.getPageData(client, config);

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

	var allModules = configOptions.pages
		.map((page) => page.module)
		.filter((module, index, self) => self.indexOf(module) === index);

	var configModuleSM = new StringSelectMenuBuilder()
		.setCustomId(
			client.createCustomId({
				customId: ConfigModuleSM.customId,
				ownerId: config.pageOwner.id,
			})
		)
		.setPlaceholder('Select a module')
		.addOptions(
			allModules.map((module) => {
				return {
					label: client.capitalize(client.addSpace(module)),
					value: module,
				};
			})
		);

	for (var option of configModuleSM.options) {
		if (config.module === option.data.value) {
			option.data.default = true;
		}
	}

	var allOptions = configOptions.pages.filter(
		(page) => page.module === config.module && page.option
	);

	var configOptionSM = new StringSelectMenuBuilder()
		.setCustomId(
			client.createCustomId({
				customId: ConfigOptionSM.customId,
				module: config.module,
				ownerId: config.pageOwner.id,
			})
		)
		.setPlaceholder('Select an option')
		.addOptions(
			allOptions.map((page) => {
				return {
					label: client.capitalize(client.addSpace(page.option)),
					value: page.option,
				};
			})
		);

	if (!config.option && allOptions.length > 0) {
		config.option = allOptions[0].option;
	}

	for (var option of configOptionSM.options) {
		if (config.option === option.data.value) {
			option.data.default = true;
		}
	}

	var rows = new Array();
	if (pageData.rows && pageData.rows.length > 0) {
		for (var row of pageData.rows) {
			rows.push(new ActionRowBuilder().addComponents(row));
		}
	}

	return {
		embeds: [em],
		rows: [
			...rows,
			//new ActionRowBuilder().addComponents(pageData.componenets),
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				configModuleSM
			),
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				configOptionSM
			),
		],
	} as {
		embeds: EmbedBuilder[];
		rows: ActionRowBuilder<
			| RoleSelectMenuBuilder
			| UserSelectMenuBuilder
			| StringSelectMenuBuilder
			| ChannelSelectMenuBuilder
			| ButtonBuilder
		>[];
	};
}
