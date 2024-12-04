import { KiwiClient } from '@/client';
import { EmbedBuilder, TextChannel } from 'discord.js';

export const logNicknameUpdate = async (
	client: KiwiClient,
	guildId: string,
	channelId: string,
	userId: string,
	oldNickname: string,
	newNickname: string
) => {
	var guild = await client.guilds.fetch(guildId);
	var channel = (await guild.channels.fetch(channelId)) as TextChannel;
	var member = await guild.members.fetch(userId);

	var logEmbed = new EmbedBuilder()
		.setTitle('User Nickname Updated')
		.setThumbnail(member.user.avatarURL())
		.setDescription(
			[
				`**User:** <@${member.id}> (${member.user.username})`,
				`**New Nickname:** ${newNickname}`,
				`**Old Nickname:** ${oldNickname}`,
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
