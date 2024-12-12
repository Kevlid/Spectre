import { Guild } from 'discord.js';
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
		console.log(verConf);
		for (var [id, member] of guild.members.cache) {
			if (
				member.roles.cache.hasAny(
					...verConf.roles.map((role) => role.roleId)
				) ||
				member.user.bot
			) {
				continue;
			}

			var { embeds, components } = await buildPendingMessage(
				client,
				guild,
				member
			);
			var pendingChannel = guild.channels.cache.get(
				verConf.pendingChannel
			);
			if (!pendingChannel || !pendingChannel.isSendable()) return;
			pendingChannel.send({
				embeds: [...embeds],
				components: [...components],
			});
		}
	},
};
