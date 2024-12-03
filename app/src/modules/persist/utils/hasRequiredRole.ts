import { KiwiClient } from '@/client';

import { getPersistConfig } from './getPersistConfig';

export const hasRequiredRole = async (
	client: KiwiClient,
	guildId: string,
	userId: string
): Promise<boolean> => {
	var perConf = await getPersistConfig(client, guildId);
	var guild = await client.guilds.fetch(guildId);
	var member = await guild.members.fetch(userId);
	for (var r of perConf.requiredRoles) {
		if (member.roles.cache.has(r.roleId)) {
			return true;
		}
	}
	return false;
};
