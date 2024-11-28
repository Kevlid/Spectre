import { KiwiClient } from '@/client';
import { EmbedBuilder, Guild, StringSelectMenuBuilder, User } from 'discord.js';

import { optionPages, Config } from './optionPages';

import { ConfigModuleSelectMenu } from '../selectmenus/configModule';

export async function getPage(client: KiwiClient, config: Config) {
	config = await optionPages.setupConfig(client, config);

	var pageData = await optionPages.pages
		.find((page) => page.moduleId === config.moduleId && !page.pageId)
		.execute(client, config);

	var description = Array.isArray(pageData.description)
		? pageData.description.join('\n')
		: pageData.description;

	var em = new EmbedBuilder()
		.setTitle('Server Configuration')
		.setThumbnail(config.guild.iconURL())
		.setFooter({
			text: `Requested by ${client.capitalize(
				config.pageOwner.username
			)}`,
			iconURL: config.pageOwner.displayAvatarURL(),
		})
		.setDescription(description);

	// TODO: Get all modules in the other file
	var allModules = 

	var configModuleSM = new StringSelectMenuBuilder()
		.setPlaceholder('Select a module')
		.addOptions(;

	return {
		embeds: [em],
	};
}
