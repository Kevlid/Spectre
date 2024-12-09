import { KiwiClient } from '@/client';

export const addUserPersistRole = async (
	client: KiwiClient,
	guildId: string,
	userId: string,
	roleId: string
) => {
	var existingRole = await client.db.repos.persistUserRole.findOne({
		where: { guildId, userId, roleId },
	});

	if (!existingRole) {
		await client.db.repos.persistUserRole.insert({
			guildId,
			userId,
			roleId,
		});
	}
};
