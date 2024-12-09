import { KiwiClient } from '@/client';

import { GuildModuleEntity } from '@/entities/GuildModule';

export const toggleModule = async (
	client: KiwiClient,
	guildId: string,
	moduleId: string,
	value: boolean
) => {
	if (!value) {
		await client.db.repos.guildModules.delete({
			guildId: guildId,
			moduleId: moduleId,
		});
	} else {
		var module = new GuildModuleEntity();
		module.guildId = guildId;
		module.moduleId = moduleId;
		await client.db.repos.guildModules.save(module);
	}
};
