import { ButtonInteraction, TextChannel, EmbedBuilder } from 'discord.js';
import { KiwiClient } from '@/client';
import { Button, CustomOptions } from '@/types/component';

/**
 * @type {Button}
 */
export const RevertListButton: Button = {
	customId: 'revert-list',
	execute: async (
		interaction: ButtonInteraction,
		options: CustomOptions,
		client: KiwiClient
	) => {
		var listConf = await client.db.repos.listConfig.findOneBy({
			guildId: interaction.guild.id,
		});

		var listChannel = (await interaction.guild.channels.fetch(
			options.cId
		)) as TextChannel;
		var listMessage = await listChannel.messages.fetch(options.msgId);
		var users = listMessage.content.split('\n');

		let index = users.indexOf(options.value);

		if (index !== -1) {
			users.splice(index, 1);
			users.splice(Number(options.oldIndex), 0, options.value);
		}

		var content = users.join('\n');

		interaction.update({ components: [] });
		listMessage.edit({ content });

		if (listConf.logChannel) {
			var log = (await interaction.guild.channels.fetch(
				listConf.logChannel
			)) as TextChannel;
			if (!log) return;
			var emDescription = [
				`**Value:** ${options.value}`,
				`**By:** <@${interaction.user.id}> (${interaction.user.username})`,
				`**In: <#${
					options.cId
				}> [Go to Message](${client.createMessageUrl(
					interaction.guild.id,
					options.cId,
					options.msgId
				)})** `,
			];
			var em = new EmbedBuilder()
				.setTitle('List Reverted')
				.setThumbnail(interaction.user.avatarURL())
				.setDescription(emDescription.join('\n'))
				.setColor(client.Settings.color)
				.setFooter({
					text: `${interaction.guild.name}`,
					iconURL: interaction.guild.iconURL(),
				})
				.setTimestamp(new Date());
			log.send({ embeds: [em] });
		}
	},
};
