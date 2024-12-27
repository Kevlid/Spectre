import { GuildMember, TextChannel } from "discord.js";
import { KiwiClient } from "@/client";
import { Event, EventList } from "@/types/event";

import { buildPendingMessage } from "../utils/buildPendingMessage";

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
		var pendingChannel = member.guild.channels.cache.get(verConf.pendingChannel) as TextChannel;
		if (!pendingChannel) return;

		var { content, embeds, components } = await buildPendingMessage(
			client,
			member.guild,
			member
		);

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
