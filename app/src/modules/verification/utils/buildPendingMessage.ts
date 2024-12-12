import { KiwiClient } from '@/client';
import {
	StringSelectMenuBuilder,
	ChannelType,
	Guild,
	GuildMember,
	Role,
	EmbedBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ButtonBuilder,
} from 'discord.js';

import { buildStringSelectMenu } from '@/utils/buildStringSelectMenu';
import { buildButton } from '@/utils/buildButton';

import { VerifyRoleSelectMenu as VerifyRoleSM } from '../selectmenus/verifyRole';
import { ApproveUserButton } from '../buttons/approveUser';
import { DenyUserButton } from '../buttons/denyUser';

export const buildPendingMessage = async (
	client: KiwiClient,
	guild: Guild,
	member: GuildMember,
	verifyRole?: string
) => {
	var verConf = await client.db.getVerificationConfig(guild.id);

	var verifyRoles = new Array<Role>();
	for (let roleObject of verConf.roles) {
		let role = await guild.roles.fetch(roleObject.roleId);
		if (role) {
			verifyRoles.push(role);
		}
	}
	if (verifyRoles.length <= 0) return; // Use a new logging system for all modules to log errors in log channels

	var pendingEmbed = new EmbedBuilder()
		.setTitle('Pending Verification')
		.setThumbnail(member.user.avatarURL())
		.setColor(client.Settings.color)
		.addFields(
			{ name: 'ID', value: `${member.user.id}` },
			{ name: 'User', value: `<@${member.user.id}>` },
			{
				name: 'Username',
				value: `${client.capitalize(member.user.username)}`,
			}
		);

	var roleSelectMenu = buildStringSelectMenu({
		customId: client.createCustomId({
			customId: VerifyRoleSM.customId,
			memberId: member.id,
		}),
		placeholder: 'Select a role',
		options: verifyRoles.map((role) => ({
			label: role.name,
			value: role.id,
		})),
		maxValues: 1,
		defaults: [verifyRole],
	});

	var ApproveButton = buildButton({
		customId: client.createCustomId({
			customId: ApproveUserButton.customId,
			roleId: verifyRole,
			memberId: member.id,
		}),
		label: 'Approve',
		style: ButtonStyle.Success,
	});
	var DenyButton = buildButton({
		customId: client.createCustomId({
			customId: DenyUserButton.customId,
			memberId: member.id,
		}),
		label: 'Deny',
		style: ButtonStyle.Danger,
	});
	var ViewProfileButton = buildButton({
		label: 'View Profile',
		style: ButtonStyle.Link,
		url: `https://discord.com/users/${member.user.id}`,
	});

	var content = '';
	if (verConf.pings) {
		content = verConf.pings?.map((ping) => `<@&${ping.roleId}>`).join(' ');
	}

	return {
		content,
		embeds: [pendingEmbed],
		components: [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
				roleSelectMenu,
			]),
			new ActionRowBuilder<ButtonBuilder>().addComponents([
				ApproveButton,
				DenyButton,
				ViewProfileButton,
			]),
		],
	};
};
