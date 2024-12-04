import { KiwiClient } from '@/client';
import { EmbedBuilder, TextChannel } from 'discord.js';

export const logRoleAdded = async (
	client: KiwiClient,
	guildId: string,
	channelId: string,
	userId: string,
	roleId: string
) => {
	var guild = await client.guilds.fetch(guildId);
	var channel = (await guild.channels.fetch(channelId)) as TextChannel;
	var member = await guild.members.fetch(userId);
	var role = await guild.roles.fetch(roleId);

	var logEmbed = new EmbedBuilder()
		.setTitle('User Role Added')
		.setThumbnail(member.user.avatarURL())
		.setDescription(
			[
				`**User:** <@${member.id}> (${member.user.username})`,
				`**Role:** <@&${role.id}> (${role.name})`,
			].join('\n')
		)
		.setColor(client.Settings.color)
		.setFooter({
			text: `${guild.name}`,
			iconURL: guild.iconURL(),
		})
		.setTimestamp(new Date());

	channel.send({ embeds: [logEmbed] });
};
