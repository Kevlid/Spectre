import { ActionRowBuilder, StringSelectMenuBuilder, User } from 'discord.js';
import { KiwiClient } from '@/client';

import { LeaderboardTypeSelectMenu as LeaderboardTypeSM } from '../selectmenus/leaderboardType';
import { LeaderboardTimeSelectMenu as LeaderboardTimeSM } from '../selectmenus/leaderboardTime';

import { createVoiceLeaderboard } from './createVoiceLeaderboard';
import { createMessageLeaderboard } from './createMessageLeaderboard';

import { buildStringSelectMenu } from '@/utils/buildStringSelectMenu';

export const getLeaderboardPage = async (
	client: KiwiClient,
	config: {
		guildId: string;
		type: string;
		time: string;
		pageOwner: User;
	}
) => {
	const { guildId, type, time, pageOwner } = config;

	var rows = [];

	switch (type) {
		case 'voice': {
			var content = (await createVoiceLeaderboard(client, guildId, time))
				.content;
			break;
		}

		case 'message': {
			var content = (
				await createMessageLeaderboard(client, guildId, time)
			).content;
			break;
		}
	}

	var { options } = LeaderboardTypeSM.config as StringSelectMenuBuilder;
	var typeSelectMenu = buildStringSelectMenu({
		customId: client.createCustomId({
			customId: LeaderboardTypeSM.customId,
			time,
			ownerId: pageOwner.id,
		}),
		placeholder: LeaderboardTypeSM.config.data.placeholder,
		options: options.map((option) => {
			return {
				label: option.data.label,
				value: option.data.value,
				description: option.data.description,
			};
		}),
		maxValues: 1,
		defaults: [type],
	});

	var { options } = LeaderboardTimeSM.config as StringSelectMenuBuilder;
	var timeSelectMenu = buildStringSelectMenu({
		customId: client.createCustomId({
			customId: LeaderboardTimeSM.customId,
			type,
			ownerId: pageOwner.id,
		}),
		placeholder: LeaderboardTimeSM.config.data.placeholder,
		options: options.map((option) => {
			return {
				label: option.data.label,
				value: option.data.value,
				description: option.data.description,
			};
		}),
		minValues: 1,
		defaults: [time],
	});

	rows.push(
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			typeSelectMenu
		),
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			timeSelectMenu
		)
	);

	return { content, rows };
};
