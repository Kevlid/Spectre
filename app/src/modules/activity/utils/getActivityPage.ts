import {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	User,
	ActivityType,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { Emojis } from '@/emojis';

import { ActivitySelectMenu as ActivitySM } from '../selectmenus/activityType';
import { getVoice } from './getVoice';

export const getActivityPage = async (
	client: KiwiClient,
	config: {
		guildId: string;
		pageId: string;
		pageOwner: User;
		user: User;
	}
) => {
	const { guildId, pageId, pageOwner, user } = config;
	var guild = await client.guilds.fetch(guildId);

	const hours = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 2,
	});
	const minutes = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	var embeds = [];
	var rows = [];

	var embedDescription = [];
	var embedFields = [];

	switch (pageId) {
		case 'status': {
			var userStatus = await client.db.repos.activityStatus.findBy({
				userId: user.id,
			});
			embedDescription.push(`### Status Activity`);
			if (userStatus.length === 0) {
				embedDescription.push(`**No Status Found**`);
			} else {
				userStatus.forEach((status) => {
					embedFields.push({
						name: `**${client.capitalize(status.name)}**`,
						value: `<t:${Math.floor(
							new Date(status.timestamp).getTime() / 1000
						)}:f> (<t:${Math.floor(
							new Date(status.timestamp).getTime() / 1000
						)}:R>)`,
					});
				});
			}
			break;
		}

		case 'presence': {
			var userPresence = await client.db.repos.activityPresence.findBy({
				userId: user.id,
			});

			embedDescription.push(`### Presence Activity`);
			if (userPresence.length === 0) {
				embedDescription.push(`**No Presence Found**`);
			} else {
				userPresence.forEach((presence) => {
					embedFields.push({
						name: `${ActivityType[presence.type]} **${
							presence.name
						}**`,
						value: `<t:${Math.floor(
							new Date(presence.startTimestamp).getTime() / 1000
						)}:f> (<t:${Math.floor(
							new Date(presence.startTimestamp).getTime() / 1000
						)}:R>)`,
					});
				});
			}
			break;
		}

		case 'voice': {
			var voice = await getVoice(client, guildId, user.id);
			if (voice) {
				var totalFormattedHours = hours.format(
					voice.totalSeconds / (60 * 60)
				);
				var totalFormattedMinutes = minutes.format(
					voice.totalSeconds / 60
				);

				var dailyFormattedHours = hours.format(
					voice.dailySeconds / (60 * 60)
				);
				var dailyFormattedMinutes = minutes.format(
					voice.dailySeconds / 60
				);

				var weeklyFormattedHours = hours.format(
					voice.weeklySeconds / (60 * 60)
				);
				var weeklyFormattedMinutes = minutes.format(
					voice.weeklySeconds / 60
				);

				var monthlyFormattedHours = hours.format(
					voice.monthlySeconds / (60 * 60)
				);
				var monthlyFormattedMinutes = minutes.format(
					voice.monthlySeconds / 60
				);

				embedDescription.push(
					`### Voice Activity`,
					`${Emojis.ReplyTop} **Total:** ${totalFormattedHours} Hours / ${totalFormattedMinutes} Minutes`,
					`${Emojis.ReplyMiddle} **Daily:** ${dailyFormattedHours} Hours / ${dailyFormattedMinutes} Minutes`,
					`${Emojis.ReplyMiddle} **Weekly:** ${weeklyFormattedHours} Hours / ${weeklyFormattedMinutes} Minutes`,
					`${Emojis.ReplyBottom} **Monthly:** ${monthlyFormattedHours} Hours / ${monthlyFormattedMinutes} Minutes`
				);
			} else {
				embedDescription.push(
					`### Voice Activity`,
					`${Emojis.ReplyBottom} **No Voice Activity Found**`
				);
			}
			break;
		}

		case 'message': {
			var userMessages = await client.db.repos.activityMessages.findOneBy(
				{ guildId: guildId, userId: user.id }
			);
			if (!userMessages) {
				embedDescription.push(
					`### Message Activity`,
					`${Emojis.ReplyBottom} **No Messages Found**`
				);
			} else {
				embedDescription.push(
					`### Message Activity`,
					`${Emojis.ReplyTop} **Total:** ${userMessages.totalMessages} messages`,
					`${Emojis.ReplyMiddle} **Daily:** ${userMessages.dailyMessages} messages`,
					`${Emojis.ReplyMiddle} **Weekly:** ${userMessages.weeklyMessages} messages`,
					`${Emojis.ReplyBottom} **Monthly:** ${userMessages.monthlyMessages} messages`
				);
			}
			break;
		}
	}

	embeds.push(
		client.Pages.generateEmbed({
			author: {
				name: `${client.capitalize(
					user.displayName
				)} (${client.capitalize(user.username)})`,
				iconURL: user.avatarURL(),
			},
			description: embedDescription.join('\n'),
			thumbnail: guild.iconURL(),
			fields: embedFields,
			footer: {
				text: `Requested by ${client.capitalize(pageOwner.username)}`,
				iconURL: pageOwner.avatarURL(),
			},
		})
	);

	var { options } = ActivitySM.config as StringSelectMenuBuilder;
	var moduleSelectMenu = client.Pages.generateSelectMenu({
		customId: client.createCustomId({
			customId: ActivitySM.customId,
			ownerId: pageOwner.id,
			userId: user.id,
		}),
		placeholder: 'Select an Activity Type',
		options: options.map((option) => {
			return {
				label: option.data.label,
				value: option.data.value,
				description: option.data.description,
			};
		}),
		defaults: [pageId],
		type: 'string',
	});

	rows.push(
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
			moduleSelectMenu
		)
	);

	return { embeds, rows };
};
