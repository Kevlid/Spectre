import {
	ButtonInteraction,
	TextChannel,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import { KiwiClient } from "@/client";
import { Button, CustomOptions } from "@/types/component";

import { RevertListButton } from "./revertList";

/**
 * @type {Button}
 */
export const UpdateListButton: Button = {
	customId: "update-list",
	execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
		var listConf = await client.db.repos.listConfig.findOneBy({
			guildId: interaction.guild.id,
		});
		var users = interaction.message.content.split("\n");

		let beforeMovePlace = users.indexOf(options.value);

		if (beforeMovePlace !== -1) {
			users.splice(beforeMovePlace, 1);
			users.push(options.value);
		}

		var content = users.join("\n");

		interaction.update({ content });

		console.log(listConf.logChannel);
		if (listConf.logChannel) {
			console.log(1);
			var log = (await interaction.guild.channels.fetch(listConf.logChannel)) as TextChannel;
			if (!log) return;
			var emDescription = [
				`**Value:** ${options.value}`,
				`**By:** <@${interaction.user.id}> (${interaction.user.username})`,
				`**In: <#${interaction.channelId}> [Go to Message](${interaction.message.url})** `,
			];
			var em = new EmbedBuilder()
				.setTitle("List Updated")
				.setThumbnail(interaction.user.avatarURL())
				.setDescription(emDescription.join("\n"))
				.setColor(client.Settings.color)
				.setFooter({
					text: `${interaction.guild.name}`,
					iconURL: interaction.guild.iconURL(),
				})
				.setTimestamp(new Date());

			var customId = await client.ComponentManager.createCustomId({
				customId: RevertListButton.customId,
				cId: interaction.channelId,
				msgId: interaction.message.id,
				value: options.value,
				oldIndex: beforeMovePlace.toString(),
			});
			var revertButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setCustomId(customId)
					.setLabel("Revert")
			);
			log.send({ components: [revertButton], embeds: [em] });
		}
	},
};
