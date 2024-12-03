import { KiwiClient } from '@/client';

export const updateVoiceState = async (
	client: KiwiClient,
	guildId: string,
	userId: string
) => {
	client.db.repos.activityVoicestates.update(
		{
			guildId,
			userId,
		},
		{
			joinedAt: new Date(),
		}
	);
};
