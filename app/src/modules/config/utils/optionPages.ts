import { KiwiClient } from '@/client';
import { Guild, User } from 'discord.js';

interface Config {
	guildId: string;
	pageId: string;
	pageOwner?: User;
	guild?: Guild;
	isEnabled?: boolean;
}

interface Page {
	id: string;
	execute: (client: KiwiClient, config: Config) => Promise<void>;
}

interface OptionPages {
	setupConfig?: (client: KiwiClient, config: Config) => Promise<Config>;
	pages: Array<Page>;
}

export const optionPages: OptionPages = {
	setupConfig: async (client, config) => {
		config.guild = await client.guilds.fetch(config.guildId);
		config.isEnabled = await client.db.isModuleEnabled(
			config.guildId,
			config.pageId
		);
		return config;
	},
	pages: [
		{
			id: 'overview',
			execute: async (client, config) => {
				const { guildId, pageId, pageOwner, guild, isEnabled } = config;
			},
		},
	],
};
