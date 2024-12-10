import { KiwiClient } from '@/client';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '@/types/command';

import { getVoiceState } from '../utils/getVoiceState';

/**
 * @type {SlashCommand}
 */
export const JoinedSlash: SlashCommand = {
	config: new SlashCommandBuilder()
		.setName('joined')
		.setDescription(
			'View how long ago you or someone else joined the voice channel'
		)
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to view')
				.setRequired(false)
		),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {KiwiClient} client
	 */
	async execute(
		interaction: ChatInputCommandInteraction,
		client: KiwiClient
	): Promise<void> {
		var user = interaction.options.getUser('user') || interaction.user;

		var voiceState = await getVoiceState(
			client,
			interaction.guildId,
			user.id
		);

		if (!voiceState) {
			interaction.reply({
				content: `<@${user.id}> is not in a voice channel`,
				allowedMentions: { parse: [] },
			});
			return;
		}

		interaction.reply({
			content: `<@${user.id}> joined the voice channel at <t:${Math.floor(
				voiceState.joinedAt.getTime() / 1000
			)}:R>`,
			allowedMentions: { parse: [] },
		});
	},
};
