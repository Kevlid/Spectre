import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { checkPermissions } from "../utils/checkPermissions";
import { GuildMember } from "discord.js";

/**
 * @type {PrefixCommand}
 */
export const DragPrefix: PrefixCommand = {
	config: {
		name: "drag",
		description: "Move a user to your voice channel",
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
		if (!message.member.voice.channel) {
			message.channel.send("You need to be in a voice channel to use this command.");
			return;
		}

		if (!member.voice.channel) {
			message.channel.send("This user is not in a voice channel.");
			return;
		}
		try {
			member.voice.setChannel(message.member.voice.channel);
		} catch (err) {
			console.log(err);
			message.channel.send("I cannot move this user.");
		}
	},
};
