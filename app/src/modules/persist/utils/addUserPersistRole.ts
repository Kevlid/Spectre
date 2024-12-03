import { KiwiClient } from '@/client';

export const addUserPersistRole = async (
	client: KiwiClient,
	guildId: string,
	userId: string,
	roleId: string
) => {
	await client.db.repos.persistUserRole.insert({
		guildId,
		userId,
		roleId,
	});
};
