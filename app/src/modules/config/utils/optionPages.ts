import { KiwiClient } from '@/client';
import { Guild, User } from 'discord.js';

export interface Config {
	guildId: string;
	moduleId: string;
	pageId?: string;
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
	pageId?: string;
	execute: (client: KiwiClient, config: Config) => Promise<PageData>;
}

interface PageData {
	description?: string[] | string;
	rows?: any[];
}

export const optionPages: OptionPages = {
	setupConfig: async (client, config) => {
		config.guild = await client.guilds.fetch(config.guildId);
		config.guildOwner = await client.users.fetch(config.guild.ownerId);
		if (config.moduleId)
			config.isEnabled = await client.db.isModuleEnabled(
				config.guildId,
				config.moduleId
			);

		return config;
	},
	pages: [
		{
			moduleId: 'activity',
			execute: async (client, config) => {
				const { isEnabled } = config;

				var description = [
					`### Activity Module`,
					`**Enabled:** ${isEnabled ? 'True' : 'False'}`,
				];

				return { description };
			},
		},
		{
			moduleId: 'activity',
			pageId: 'logChannel',
			execute: async (client, config) => {
				const { guildId, isEnabled } = config;

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
			pageId: 'dailyActiveRole',
			execute: async (client, config) => {
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
			pageId: 'weeklyActiveRole',
			execute: async (client, config) => {
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
	],
};
