import { ButtonInteraction, EmbedBuilder, TextChannel } from "discord.js";
import { KiwiClient } from "@/client";
import { Button, CustomOptions } from "@/types/component";

export const ApproveUserButton: Button = {
	customId: "approve-user",
	execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
		if (!options.roleId) {
			interaction.reply({
				content: "You need to pick the role you want to give to the user",
				ephemeral: true,
			});
			return;
		}
		await interaction.message.delete().catch(() => {});
		await client.db.deletePendingMessages({
			guildId: interaction.guild.id,
			userId: options.memberId,
		});
		var verConf = await client.db.getVerificationConfig(interaction.guild.id);
		var role = await interaction.guild.roles.fetch(options.roleId);
		if (!role) {
			interaction.reply({
				content: "Role not found",
				ephemeral: true,
			});
			return;
		}
		var member = await interaction.guild.members.fetch(options.memberId);
		if (!member || !options.memberId) {
			interaction.reply({
				content: "Member not found",
				ephemeral: true,
			});
			return;
		}
		await member.roles.add(role).catch(() => {});

		var ApprovedEmbed = new EmbedBuilder()
			.setTitle("You've Been Approved")
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: "Server ID", value: interaction.guild.id },
				{ name: "Server Name", value: interaction.guild.name },
				{
					name: "Can't find it",
					value: `[Click Here](https://discord.com/channels/${interaction.guild.id})`,
				}
			)
			.setFooter({ text: "Enjoy your stay!" })
			.setColor(client.Colors.success);
		await member.send({ embeds: [ApprovedEmbed] }).catch(() => {});

		interaction.reply({
			content: `**<@${member.id}>** has been approved!`,
			ephemeral: true,
			allowedMentions: { users: [] },
		});

		var logChannel = interaction.guild.channels.cache.get(verConf.logChannel) as TextChannel;
		if (!logChannel) return;
		var LogEmbed = new EmbedBuilder()
			.setTitle("Approved User")
			.setThumbnail(member.user.avatarURL())
			.setColor(client.Colors.success)
			.addFields(
				{
					name: "User",
					value: `<@${member.user.id}>\n${client.capitalize(member.user.username)}`,
				},
				{
					name: "Approved By",
					value: `<@${interaction.user.id}>\n${client.capitalize(
						interaction.user.username
					)}`,
				},
				{
					name: "Role",
					value: `<@&${role.id}>\n${role.name}`,
				}
			);

		logChannel.send({ embeds: [LogEmbed] });
	},
};
