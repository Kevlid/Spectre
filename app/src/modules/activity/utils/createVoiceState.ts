import { KiwiClient } from '@/client';

export const createVoiceState = async (
	client: KiwiClient,
	guildId: string,
	userId: string
) => {
	await client.db.repos.activityVoicestates.insert({
		guildId: guildId,
		userId: userId,
	});
};
