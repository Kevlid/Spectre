import { GuildMember } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

export const GuildMemberAdd: Event = {
	name: EventList.GuildMemberAdd,

	async getGuildId(member: GuildMember) {
		return member.guild.id;
	},

	async execute(client: KiwiClient, member: GuildMember) {
		if (member.user.bot) return;
	},
};
