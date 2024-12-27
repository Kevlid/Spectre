import { ButtonInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { KiwiClient } from "@/client";
import { Button, CustomOptions } from "@/types/component";

export const DenyUserButton: Button = {
	customId: "deny-user",
	execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
		await interaction.message.delete().catch(() => {});
		await client.db.deletePendingMessages({
			guildId: interaction.guild.id,
			userId: options.memberId,
		});
		var verConf = await client.db.getVerificationConfig(interaction.guild.id);
		var member = await interaction.guild.members.fetch(options.memberId);
		if (!member || !options.memberId) {
			interaction.reply({
				content: "Member not found",
				ephemeral: true,
			});
			return;
		}

		var DeniedEmbed = new EmbedBuilder()
			.setTitle("You've Been Denied")
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: "Server ID", value: interaction.guild.id },
				{ name: "Server Name", value: interaction.guild.name }
			)
			.setFooter({ text: "Sorry!" })
			.setColor(client.Colors.fail);

		await member.send({ embeds: [DeniedEmbed] }).catch(() => {});
		await member.kick("Denied").catch(() => {});

		interaction.reply({
			content: `**<@${member.id}>** has been denied and kicked from the server!`,
			ephemeral: true,
			allowedMentions: { users: [] },
		});

		var logChannel = interaction.guild.channels.cache.get(verConf.logChannel) as TextChannel;
		if (!logChannel) return;
		var logEmbed = new EmbedBuilder()
			.setTitle("Denied User")
			.setThumbnail(member.avatarURL())
			.addFields(
				{
					name: "User",
					value: `<@${member.id}>\n${client.capitalize(member.user.username)}`,
				},
				{
					name: "Denied By",
					value: `<@${interaction.user.id}>\n${client.capitalize(
						interaction.user.username
					)}`,
				}
			)
			.setColor(client.Colors.fail);

		logChannel.send({ embeds: [logEmbed] });
	},
};
