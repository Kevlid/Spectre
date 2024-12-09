import { KiwiClient } from '@/client';

export const isPersistRole = async (
	client: KiwiClient,
	guildId: string,
	roleId: string
) => {
	var persistRole = await client.db.repos.persistConfigRole.findOneBy({
		guildId: guildId,
		roleId: roleId,
	});
	if (persistRole) {
		return true;
	} else {
		return false;
	}
};
