import { KiwiClient } from '@/client';

export const saveVoice = async (
	client: KiwiClient,
	guildId: string,
	userId: string,
	seconds: number
) => {
	var userVoice = await client.db.repos.activityVoice.findOneBy({
		guildId,
		userId,
	});
	var user = await client.users.fetch(userId);
	userVoice.userName = user.username;
	userVoice.totalSeconds += seconds;
	userVoice.dailySeconds += seconds;
	userVoice.weeklySeconds += seconds;
	userVoice.monthlySeconds += seconds;
	client.db.repos.activityVoice.save(userVoice);
};
