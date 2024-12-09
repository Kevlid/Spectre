import { KiwiClient } from '@/client';

export const isAnyPersistRole = async (
	client: KiwiClient,
	guildId: string,
	roleIds: string[]
) => {
	for (let roleId of roleIds) {
		var persistRole = await client.db.repos.persistConfigRole.findOneBy({
			guildId: guildId,
			roleId: roleId,
		});
		if (persistRole) {
			return true;
		} else {
			return false;
		}
	}
};
