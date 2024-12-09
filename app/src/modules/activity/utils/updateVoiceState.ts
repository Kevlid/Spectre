import { KiwiClient } from '@/client';

export const updateVoiceState = async (
	client: KiwiClient,
	guildId: string,
	userId: string
) => {
	await client.db.repos.activityVoicestates.update(
		{
			guildId,
			userId,
		},
		{
			lastUpdate: new Date(),
		}
	);
};
