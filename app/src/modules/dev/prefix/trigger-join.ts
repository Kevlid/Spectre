import { PrefixCommand, ConfigOptionTypes } from "@/types/command";

import { GuildMember } from "discord.js";

export const TriggerJoinPrefix: PrefixCommand = {
	config: {
		name: "trigger-join",
		description: "Trigger the guildMemberAdd event",
		options: [
			{
				name: "member",
				type: ConfigOptionTypes.MEMBER,
			},
		],
	},
	async execute(client, message, commandOptions, member: GuildMember) {
		client.emit("guildMemberAdd", member);
	},
};
