import { KiwiClient } from '@/client';
import { ActionRowBuilder, AnyComponentBuilder, Guild, User } from 'discord.js';

export interface Config {
	guildId: string;
	moduleId: string;
	optionId?: string;
	pageOwner?: User;
	guild?: Guild;
	guildOwner?: User;
	isEnabled?: boolean;
}

interface OptionPages {
	setupConfig?: (client: KiwiClient, options: Config) => Promise<Config>;
	pages: Array<Page>;
}

interface Page {
	moduleId: string;
	optionId?: string;
	getPageData: (client: KiwiClient, config: Config) => Promise<PageData>;
}

interface PageData {
	description?: string[] | string;
	componenets?: AnyComponentBuilder;
	rows?: AnyComponentBuilder[];
}

import { createOverviewButtons } from './createOverviewButtons';

export const optionPages: OptionPages = {
	setupConfig: async (client, config) => {
		config.guild = await client.guilds.fetch(config.guildId);
		config.guildOwner = await client.users.fetch(config.guild.ownerId);
		if (config.moduleId)
			config.isEnabled = await client.db.isModuleEnabled(
				config.guildId,
				config.moduleId
			);

		if (!config.optionId) config.optionId = 'overview';

		return config;
	},
	pages: [
		{
			moduleId: 'activity',
			optionId: 'overview',
			getPageData: async (client, config) => {
				const { isEnabled } = config;

				var description = [
					`### Activity Module`,
					`**Enabled:** ${isEnabled ? 'True' : 'False'}`,
				];

				var overviewButtons = createOverviewButtons(client, config);

				return { description, rows: [overviewButtons] };
			},
		},
		{
			moduleId: 'activity',
			optionId: 'logChannel',
			getPageData: async (client, config) => {
				const { guildId } = config;

				var actConf = await client.db.repos.activityConfig.findOneBy({
					guildId: guildId,
				});

				var description = [
					`### Activity Module`,
					`**Log Channel:** ${
						actConf?.logChannel
							? `<#${actConf.logChannel}>`
							: 'None'
					}`,
				];

				return { description };
			},
		},
		{
			moduleId: 'activity',
			optionId: 'dailyActiveRole',
			getPageData: async (client, config) => {
				const { guildId } = config;

				var actConf = await client.db.repos.activityConfig.findOneBy({
					guildId: guildId,
				});

				var description = [
					`### Activity Module`,
					`**Daily Active Role:** ${
						actConf?.dailyActiveRole
							? `<@&${actConf.dailyActiveRole}>`
							: 'None'
					}`,
				];

				return { description };
			},
		},
		{
			moduleId: 'activity',
			optionId: 'weeklyActiveRole',
			getPageData: async (client, config) => {
				const { guildId } = config;

				var actConf = await client.db.repos.activityConfig.findOneBy({
					guildId: guildId,
				});

				var description = [
					`### Activity Module`,
					`**Weekly Active Role:** ${
						actConf?.weeklyActiveRole
							? `<@&${actConf.weeklyActiveRole}>`
							: 'None'
					}`,
				];

				return { description };
			},
		},
		{
			moduleId: 'persist',
			optionId: 'overview',
			async getPageData(client, config) {
				const { isEnabled } = config;

				var description = [
					`### Persist Module`,
					`**Enabled:** ${isEnabled ? 'True' : 'False'}`,
				];

				var overviewButtons = createOverviewButtons(client, config);

				return { description, rows: [overviewButtons] };
			},
		},
	],
};
