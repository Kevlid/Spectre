import { KiwiClient } from '@/client';

export const getUserPersistRoles = async (
	client: KiwiClient,
	guildId: string,
	userId: string
) => {
	return await client.db.repos.persistUserRole.findBy({
		guildId,
		userId,
	});
};
