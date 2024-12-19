import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { checkPermissions } from "../../moderation/utils/checkPermissions";
import { GuildMember, GuildTextBasedChannel, TextChannel, User } from "discord.js";

/**
 * @type {PrefixCommand}
 */
export const DeleteManyPrefix: PrefixCommand = {
	config: {
		name: "delete-many",
		description: "Deletes x amount of a users messages from the channel",
		aliases: ["deletemany", "dm"],
		autoDelete: true,
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
			},
			{
				name: "amount",
				type: ConfigOptionTypes.NUMBER,
			},
		],
	},
	async checks(client, message, commandOptions) {
		return await checkPermissions(client, message.guildId, message.author.id);
	},
	async execute(client, message, commandOptions, user: GuildMember, amount: number) {
		amount = Math.min(amount, 100);
		let fetchedMessages;
		let userMessages = [];
		let lastMessageId = message.id;
		let maxSeachAmount = 1000;

		while (userMessages.length < amount) {
			fetchedMessages = await message.channel.messages.fetch({
				limit: 50,
				before: lastMessageId,
			});
			if (fetchedMessages.size === 0) break;
			if ((maxSeachAmount -= 50) <= 0) break;

			const filteredMessages = fetchedMessages.filter((msg) => msg.author.id === user.id);
			userMessages = userMessages.concat(Array.from(filteredMessages.values()));

			lastMessageId = fetchedMessages.last().id;
		}

		userMessages = userMessages.slice(0, amount);
		await (message.channel as TextChannel).bulkDelete(userMessages, true);
	},
};
