import { KiwiClient } from '@/client';

export const saveVoice = async (
	client: KiwiClient,
	guildId: string,
	userId: string,
	userName: string,
	seconds: number
) => {
	var userVoice = await client.db.repos.activityVoice.findOneBy({
		guildId,
		userId,
	});

	if (!userVoice) {
		await client.db.repos.activityVoice.insert({
			guildId,
			userId,
			userName,
			totalSeconds: seconds,
			dailySeconds: seconds,
			weeklySeconds: seconds,
			monthlySeconds: seconds,
		});
	} else {
		await client.db.repos.activityVoice.update(
			{
				guildId,
				userId,
			},
			{
				userName,
				totalSeconds: userVoice.totalSeconds + seconds,
				dailySeconds: userVoice.dailySeconds + seconds,
				weeklySeconds: userVoice.weeklySeconds + seconds,
				monthlySeconds: userVoice.monthlySeconds + seconds,
			}
		);
	}
};
