import { KiwiClient } from '@/client';

export const getPersistConfig = async (client: KiwiClient, guildId: string) => {
	return await client.db.repos.persistConfig.findOne({
		where: { guildId },
		relations: ['persistRoles', 'requiredRoles'],
	});
};
