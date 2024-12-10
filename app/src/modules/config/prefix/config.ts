import { PrefixCommand } from '@/types/command';
import { getPage } from '../utils/getPage';

export const ConfigPrefix: PrefixCommand = {
	config: {
		name: 'config',
		description: 'Access the Server configuration',
		aliases: ['cfg'],
	},
	async execute(client, message, commandOptions) {
		var page = await getPage(client, {
			guildId: message.guildId,
			moduleId: 'activity',
			optionId: 'overview',
			pageOwner: message.author,
		});

		message.reply({
			embeds: [...page.embeds],
			components: [...page.rows],
		});
	},
};
