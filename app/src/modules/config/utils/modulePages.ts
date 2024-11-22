import {
	ActionRowBuilder,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	User,
	Interaction,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { Emojis } from '@/emojis';

import { ConfigSelectMenu } from '../selectmenus/configType';
import { ConfigChannelSelectMenu as ChannelSM } from '../selectmenus/configChannel';
import { ConfigRoleSelectMenu as RoleSM } from '../selectmenus/configRole';

import { generateModuleButtons } from './generateModuleButtons';

interface Pages {
	[key: string]: (
		client: KiwiClient,
		config: {
			guildId: string;
			pageId: string;
			pageOwner?: User;
		}
	) => Promise<void> | undefined;
}

export class modulePages {
	private interaction: Interaction;
	private client: KiwiClient;

	constructor(interaction: Interaction, client: KiwiClient) {
		this.interaction = interaction;
		this.client = client;
	}

	public async beforeAll() {
		// Code here
	}

	public async afterAll() {}

	public async getPage(id: string) {}
}

const pages: Pages = {
	overview: async (client, config) => {
		const { guildId, pageId, pageOwner } = config;
		var guild = await client.guilds.fetch(guildId);
		var owner = await client.users.fetch(guild.ownerId);
		var embedDescription = [
			`### Guild Overview`,
			`${Emojis.ReplyTop} **Owner:** ${owner.displayName} (${owner.username})`,
			`${Emojis.ReplyMiddle} **Members:** ${guild.memberCount}`,
			`${Emojis.ReplyBottom} **Ping:** ${Math.round(client.ws.ping)}ms`,
		];
	},

	activity: async (client, config) => {
		const { guildId, pageId, pageOwner } = config;
		var guild = await client.guilds.fetch(guildId);
		var isEnabled = await client.db.repos.guildModules.findOneBy({
			guildId: guildId,
			moduleId: pageId,
		});
		var actConf = await client.db.repos.activityConfig.findOneBy({
			guildId: guildId,
		});
		var embedDescription = [
			`### Activity Module`,
			`${Emojis.ReplyTop} **Enabled:** ${isEnabled ? 'True' : 'False'}`,
			`${Emojis.ReplyMiddle} **Log Channel:** ${
				actConf.logChannel ? `<#${actConf.logChannel}>` : 'Not Set'
			}`,
		];
	},

	verification: async (client, config) => {
		const { guildId, pageId, pageOwner } = config;
		var guild = await client.guilds.fetch(guildId);
		var isEnabled = await client.db.repos.guildModules.findOneBy({
			guildId: guildId,
			moduleId: pageId,
		});
		var verConf = await client.db.repos.verificationConfig.findOneBy({
			guildId: guildId,
		});
		var embedDescription = [
			`### Verification Module`,
			`${Emojis.ReplyTop} **Enabled:** ${isEnabled ? 'True' : 'False'}`,
			`${Emojis.ReplyMiddle} **Log Channel:** ${
				verConf.logChannelId ? `<#${verConf.logChannelId}>` : 'Not Set'
			}`,
			`${Emojis.ReplyBottom} **Verification Role:** ${
				verConf.verificationRoleId
					? `<@&${verConf.verificationRoleId}>`
					: 'Not Set'
			}`,
		];
	},
};
