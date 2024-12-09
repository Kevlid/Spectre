import { GuildMember, VoiceState } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { addUserPersistRole } from '../utils/addUserPersistRole';
import { getPersistConfig } from '../utils/getPersistConfig';
import { isPersistRole } from '../utils/isPersistRole';
import { isAnyPersistRole } from '../utils/isAnyPersistRole';
import { updateNickname } from '../utils/updateNickname';
import { hasRequiredRole } from '../utils/hasRequiredRole';
import { getUserPersistRoles } from '../utils/getUserPersistRoles';
import { logNicknameUpdate } from '../utils/logNicknameUpdate';
import { logRoleAdded } from '../utils/logRoleAdded';

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
	name: EventList.GuildMemberUpdate,

	/**
	 * @param {GuildMember} member
	 */
	async getGuildId(member: GuildMember) {
		return member.guild.id;
	},

	/**
	 * @param {KiwiClient} client
	 * @param {GuildMember} oldMember
	 * @param {GuildMember} newMember
	 */
	async execute(
		client: KiwiClient,
		oldMember: GuildMember,
		newMember: GuildMember
	) {
		if (newMember.user.bot) return;
		var perConf = await getPersistConfig(client, newMember.guild.id);

		if (
			newMember.nickname &&
			oldMember.nickname !== newMember.nickname &&
			perConf?.nicknames
		) {
			updateNickname(
				client,
				newMember.guild.id,
				newMember.id,
				newMember.nickname
			);
		}

		for (let role of oldMember.roles.cache.values()) {
			if (newMember.roles.cache.has(role.id)) continue;
			await client.db.repos.persistUserRole.delete({
				guildId: oldMember.guild.id,
				userId: oldMember.id,
				roleId: role.id,
			});
		}

		for (let role of newMember.roles.cache.values()) {
			if (oldMember.roles.cache.has(role.id)) continue;
			if (!(await isPersistRole(client, newMember.guild.id, role.id)))
				continue;
			addUserPersistRole(
				client,
				newMember.guild.id,
				newMember.id,
				role.id
			);
		}

		var newRoleIds = newMember.roles.cache
			.filter((role) => !oldMember.roles.cache.has(role.id))
			.map((role) => role.id);

		if (
			perConf.requiredRoles.length < 0 ||
			!(await hasRequiredRole(client, newMember.guild.id, newMember.id))
		)
			return;

		if (perConf.nicknames) {
			var userNickName = await client.db.repos.persistNickname.findOneBy({
				guildId: newMember.guild.id,
				userId: newMember.id,
			});
			if (userNickName && userNickName.nickName !== newMember.nickname) {
				newMember.setNickname(userNickName.nickName).catch((err) => {
					console.log(err);
				});
				logNicknameUpdate(
					client,
					newMember.guild.id,
					perConf.logChannel,
					newMember.id,
					oldMember.nickname,
					userNickName.nickName
				);
			}
		}

		if (
			!(
				await newMember.guild.members.fetch(newMember.id)
			).roles.cache.hasAny(...newRoleIds)
		) {
			var userPersistRoles = await getUserPersistRoles(
				client,
				newMember.guild.id,
				newMember.id
			);
			for (var role of userPersistRoles) {
				if (
					!(await isPersistRole(
						client,
						newMember.guild.id,
						role.roleId
					))
				)
					continue;

				if (newMember.roles.cache.has(role.roleId)) continue;
				newMember.roles.add(role.roleId).catch(() => {});

				logRoleAdded(
					client,
					newMember.guild.id,
					perConf.logChannel,
					newMember.id,
					role.roleId
				);
			}
		}
	},
};
