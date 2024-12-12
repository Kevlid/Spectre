import { env } from '@/env';
import { PrefixCommand } from '@/types/command';

export const UpdatePrefix: PrefixCommand = {
	config: {
		name: 'update',
		description: 'Updates the whole service',
	},
	async execute(client, message, commandOptions) {
		await message.reply('Updating...');

		if (env.RESTART_WEBHOOK_URL) {
			fetch(env.RESTART_WEBHOOK_URL);
		} else {
			message.reply('Update webhook URL not set');
		}
	},
};
