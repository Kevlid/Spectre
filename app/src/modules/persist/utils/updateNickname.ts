import { KiwiClient } from '@/client';

export const updateNickname = async (
	client: KiwiClient,
	guildId: string,
	userId: string,
	nickname: string
) => {
	if (nickname) {
		await client.db.repos.persistNickname.upsert(
			{
				guildId: guildId,
				userId: userId,
				nickName: nickname,
			},
			['guildId', 'userId']
		);
	} else {
		await client.db.repos.persistNickname.delete({
			guildId: guildId,
			userId: userId,
		});
	}
};
