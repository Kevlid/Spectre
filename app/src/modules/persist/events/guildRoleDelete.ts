import { GuildMember, Role } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { isPersistRole } from '../utils/isPersistRole';
import { getPersistConfig } from '../utils/getPersistConfig';

/**
 * @type {Event}
 */
export const GuildRoleDelete: Event = {
	name: EventList.GuildRoleDelete,

	/**
	 * @param {Role} role
	 */
	async getGuildId(role: Role) {
		return role.guild.id;
	},

	/**
	 * @param {KiwiClient} client
	 * @param {Role} role
	 */
	async execute(client: KiwiClient, role: Role) {
		if (!isPersistRole(client, role.guild.id, role.id)) return;

		await client.db.repos.persistUserRole.delete({
			guildId: role.guild.id,
			roleId: role.id,
		});

		await client.db.repos.persistConfigRequiredRole.delete({
			guildId: role.guild.id,
			roleId: role.id,
		});

		await client.db.repos.persistConfigRole.delete({
			guildId: role.guild.id,
			roleId: role.id,
		});
	},
};
