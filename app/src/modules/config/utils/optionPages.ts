import { KiwiClient } from '@/client';
import { Guild, User } from 'discord.js';

interface Config {
	guildId: string;
	pageId: string;
	moduleId?: string;
	pageOwner?: User;
	guild?: Guild;
	guildOwner?: User;
	isEnabled?: boolean;
}

interface PageOptions {
	description?: string[] | string;
	rows?: any[];
}

interface Page {
	id: string;
	option?: string;
	execute: (client: KiwiClient, config: Config) => Promise<PageOptions>;
}

interface OptionPages {
	setupConfig?: (client: KiwiClient, config: Config) => Promise<Config>;
	pages: Array<Page>;
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
			id: 'overview',
			execute: async (client, config) => {
				const { guild, guildOwner } = config;

				var description = [
					`### Guild Overview`,
					`**Owner:** ${guildOwner.displayName} (${guildOwner.username})`,
					`**Members:** ${guild.memberCount}`,
					`**Ping:** ${Math.round(client.ws.ping)}ms`,
				];

				return { description };
			},
		},
		{
			id: 'activity',
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
			id: 'activity',
			option: 'logChannel',
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
			id: 'activity',
			option: 'dailyActiveRole',
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
			id: 'activity',
			option: 'weeklyActiveRole',
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
