import { KiwiClient } from '@/client';

export const roleExists = (
	client: KiwiClient,
	guildId: string,
	roleId: string
): Boolean => {
	var guild = client.guilds.cache.get(guildId);
	if (!guild) return false;
	var role = guild.roles.cache.get(roleId);
	if (role) return true;
	return false;
};
