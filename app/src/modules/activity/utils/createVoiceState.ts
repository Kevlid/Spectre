import { KiwiClient } from '@/client';

export const createVoiceState = async (
	client: KiwiClient,
	guildId: string,
	userId: string
) => {
	client.db.repos.activityVoicestates.save({
		guildId: guildId,
		userId: userId,
		joinedAt: new Date(),
	});
};
