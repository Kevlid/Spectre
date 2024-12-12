import {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	GuildMember,
	TextChannel,
	ButtonStyle,
	Role,
	StringSelectMenuBuilder,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';
import { buildButton } from '@/utils/buildButton';

import { VerifyRoleSelectMenu as VerifyRoleSM } from '../selectmenus/verifyRole';
import { ApproveUserButton } from '../buttons/approveUser';
import { DenyUserButton } from '../buttons/denyUser';
import { buildStringSelectMenu } from '@/utils/buildStringSelectMenu';
import { buildPendingMessage } from '../utils/buildPendingMessage';

export const GuildMemberAdd: Event = {
	name: EventList.GuildMemberAdd,

	async getGuildId(member: GuildMember) {
		return member.guild.id;
	},

	async execute(client: KiwiClient, member: GuildMember) {
		if (member.user.bot) return;

		var oldPendingMessage = await client.db.getPendingMessage({
			guildId: member.guild.id,
			userId: member.id,
		});
		if (oldPendingMessage) return;

		var verConf = await client.db.getVerificationConfig(member.guild.id);
		var pendingChannel = member.guild.channels.cache.get(
			verConf.pendingChannel
		);
		if (!pendingChannel) return;

		var { content, embeds, components } = await buildPendingMessage(
			client,
			member.guild,
			member
		);

		if (!pendingChannel.isSendable()) return;
		var pendingMessage = await pendingChannel.send({
			content,
			embeds: [...embeds],
			components: [...components],
		});
		client.db.createPendingMessage({
			guildId: member.guild.id,
			userId: member.id,
			messageId: pendingMessage.id,
		});
	},
};
