import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { checkPermissions } from "../utils/checkPermissions";
import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

/**
 * @type {PrefixCommand}
 */
export const DragPrefix: PrefixCommand = {
	config: {
		name: "drag",
		description: "Move a user to your voice channel",
		autoDelete: true,
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
			},
		],
	},
	async checks(client, message, commandOptions) {
		return await checkPermissions(client, message.guildId, message.author.id);
	},
	async execute(client, message, commandOptions, member: GuildMember) {
		var oldVoiceChannel = member.voice.channel;
		if (!message.member.voice.channel) {
			commandOptions.channel.send("You need to be in a voice channel to use this command.");
			return;
		}

		if (!member.voice.channel) {
			commandOptions.channel.send("This user is not in a voice channel.");
			return;
		}
		try {
			member.voice.setChannel(message.member.voice.channel);
		} catch (err) {
			console.log(err);
			commandOptions.channel.send("I cannot move this user.");
		}

		try {
			var dragEmbed = new EmbedBuilder()
				.setTitle("User Moved")
				.setColor(client.Colors.normal)
				.addFields(
					{
						name: "User",
						value: `<@${member.id}>\n${member.user.username}`,
					},
					{
						name: "Moderator",
						value: `<@${message.author.id}>\n${message.author.username}`,
					},
					{
						name: "Old Channel",
						value: `<#${oldVoiceChannel.id}>\n${oldVoiceChannel.name}`,
					},
					{
						name: "New Channel",
						value: `<#${message.member.voice.channelId}>\n${message.member.voice.channel.name}`,
					}
				);

			commandOptions.channel.send({ embeds: [dragEmbed] });

			var modConf = await client.db.getModerationConfig(message.guildId);

			if (!modConf.logChannel) return;
			var logChannel = (await message.guild.channels.fetch(
				modConf.logChannel
			)) as TextChannel;

			if (!logChannel) return;
			logChannel.send({ embeds: [dragEmbed] });
		} catch (err) {
			console.log(err);
		}
	},
};
