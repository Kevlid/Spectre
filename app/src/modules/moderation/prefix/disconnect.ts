import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { checkPermissions } from "../utils/checkPermissions";
import { GuildMember, TextChannel, EmbedBuilder } from "discord.js";

/**
 * @type {PrefixCommand}
 */
export const DisconnectPrefix: PrefixCommand = {
	config: {
		name: "disconnect",
		description: "Kick a user from a voice channel",
		aliases: ["voice-kick", "voicekick", "vc-kick", "vckick"],
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
		var voiceChannel = member.voice.channel;

		try {
			member.voice.disconnect();
		} catch (err) {
			console.log(err);
			commandOptions.channel.send("I cannot disconnect this user.");
			return;
		}

		try {
			var disconnectedEmbed = new EmbedBuilder()
				.setTitle("User Disconnected")
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
						name: "Channel",
						value: `<#${voiceChannel.id}>\n${voiceChannel.name}`,
					}
				);

			commandOptions.channel.send({ embeds: [disconnectedEmbed] });

			var modConf = await client.db.getModerationConfig(message.guildId);

			if (!modConf.logChannel) return;
			var logChannel = (await message.guild.channels.fetch(
				modConf.logChannel
			)) as TextChannel;

			if (!logChannel) return;
			logChannel.send({ embeds: [disconnectedEmbed] });
		} catch (err) {
			console.log(err);
		}
	},
};
