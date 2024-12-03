import { GuildMember, VoiceState } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { getPersistConfig } from '../utils/getPersistConfig';
import { hasRequiredRole } from '../utils/hasRequiredRole';
import { getUserPersistRoles } from '../utils/getUserPersistRoles';

/**
 * @type {Event}
 */
export const GuildMemberAdd: Event = {
	name: EventList.GuildMemberAdd,

	/**
	 * @param {GuildMember} member
	 */
	async getGuildId(member: GuildMember) {
		return member.guild.id;
	},

	/**
	 * @param {KiwiClient} client
	 * @param {GuildMember} member
	 */
	async execute(client: KiwiClient, member: GuildMember) {
		if (member.user.bot) return;
		var perConf = await getPersistConfig(client, member.guild.id);

		if (perConf.requiredRoles.length > 0) return;

		if (perConf.nicknames) {
			var userNickName = await client.db.repos.persistNickname.findOneBy({
				guildId: member.guild.id,
				userId: member.id,
			});
			if (userNickName) {
				member.setNickname(userNickName.nickName).catch(() => {});
			}
		}

		var userPersistRoles = await getUserPersistRoles(
			client,
			member.guild.id,
			member.id
		);
		for (var role of userPersistRoles) {
			if (perConf.persistRoles.find((r) => r.roleId === role.roleId)) {
				member.roles.add(role.roleId).catch(() => {});
			}
		}
	},
};
