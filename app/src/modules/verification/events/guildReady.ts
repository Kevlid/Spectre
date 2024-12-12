import { Guild, TextChannel } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { buildPendingMessage } from '../utils/buildPendingMessage';

export const GuildReady: Event = {
	name: EventList.GuildReady,

	async getGuildId(guild: Guild) {
		return guild.id;
	},

	async execute(client: KiwiClient, guild: Guild) {
		var verConf = await client.db.getVerificationConfig(guild.id);
		var oldPendingMessages = await client.db.getPendingMessages({
			guildId: guild.id,
		});
		for (var oldPendingMessage of oldPendingMessages) {
			let member = await guild.members
				.fetch(oldPendingMessage.userId)
				.catch(() => {});
			let pendingChannel = (await guild.channels.fetch(
				verConf.pendingChannel
			)) as TextChannel;
			let pendingMessage = await pendingChannel.messages
				.fetch(oldPendingMessage.messageId)
				.catch(() => {});
			if (!pendingMessage || !member) {
				await client.db.deletePendingMessages({
					guildId: guild.id,
					userId: oldPendingMessage.userId,
				});
				if (pendingMessage)
					await pendingMessage.delete().catch(() => {});
			}
		}

		for (var [id, member] of guild.members.cache) {
			if (
				member.roles.cache.hasAny(
					...verConf.roles.map((role) => role.roleId)
				) ||
				member.user.bot
			) {
				continue;
			}

			var oldPendingMessage = await client.db.getPendingMessage({
				guildId: member.guild.id,
				userId: member.id,
			});
			if (oldPendingMessage) continue;

			var { content, embeds, components } = await buildPendingMessage(
				client,
				guild,
				member
			);
			var pendingChannel = guild.channels.cache.get(
				verConf.pendingChannel
			);
			if (!pendingChannel || !pendingChannel.isSendable()) continue;
			var pendingMessage = await pendingChannel.send({
				content,
				embeds: [...embeds],
				components: [...components],
			});
			client.db.createPendingMessage({
				guildId: guild.id,
				userId: member.id,
				messageId: pendingMessage.id,
			});
		}
	},
};
