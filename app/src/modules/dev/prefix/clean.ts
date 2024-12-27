import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { TextChannel } from "discord.js";

/**
 * @type {PrefixCommand}
 */
export const CleanPrefix: PrefixCommand = {
	config: {
		name: "clean",
		description: "Deletes x amount of messages from the channel",
		aliases: ["clear", "prune"],
		autoDelete: true,
		options: [
			{
				name: "amount",
				type: ConfigOptionTypes.NUMBER,
			},
		],
	},

	async execute(client, message, commandOptions, amount: number) {
		amount = Math.min(amount, 100);

		var channel = message.channel as TextChannel;
		channel.bulkDelete(amount, true);
	},
};
