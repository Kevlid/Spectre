import { KiwiClient } from '@/client';
import { ConfigOptionTypes, PrefixCommand } from '@/types/command';

export const CleanDatabasePrefix: PrefixCommand = {
	config: {
		name: 'clean-database',
		description: 'Clears a guild from the database',
		aliases: ['cleandatabase', 'clean-db', 'cleandb'],
		options: [
			{
				name: 'guildId',
				type: ConfigOptionTypes.TEXT,
			},
		],
	},
	async execute(client, message, commandOptions, guildId: string) {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			await cleanGuild(client, guildId);
			await message.reply('Database cleaned from ' + guildId);
		} else {
			await message.reply(
				"You can't clean the database of a guild that I'm in"
			);
		}
	},
};

async function cleanGuild(client: KiwiClient, guildId: string) {
	await client.db.repos.activityConfig.delete({ guildId });
	await client.db.repos.activityMessages.delete({ guildId });
	await client.db.repos.activityVoice.delete({ guildId });
	await client.db.repos.activityVoicestates.delete({ guildId });
	await client.db.repos.guildModules.delete({ guildId });
	await client.db.repos.listConfig.delete({ guildId });
	await client.db.repos.moderationConfig.delete({ guildId });
	await client.db.repos.moderationConfigRole.delete({ guildId });
	await client.db.repos.persistConfig.delete({ guildId });
	await client.db.repos.persistConfigRequiredRole.delete({ guildId });
	await client.db.repos.persistConfigRole.delete({ guildId });
	await client.db.repos.persistNickname.delete({ guildId });
	await client.db.repos.persistUserRole.delete({ guildId });
}
