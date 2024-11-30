import { KiwiClient } from '@/client';

export const checkPermissions = async (
	client: KiwiClient,
	guildId: string,
	userId: string
): Promise<boolean> => {
	var guild = await client.guilds.fetch(guildId);
	var member = await guild.members.fetch(userId);

	var modConf = await client.db.repos.moderationConfig.findOne({
		where: { guildId },
		relations: ['roles'],
	});

	var roleIds = modConf.roles.map((role) => role.roleId);
	return member.roles.cache.hasAny(...roleIds);
};
