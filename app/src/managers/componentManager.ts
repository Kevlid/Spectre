import { Collection, MessageComponentInteraction } from 'discord.js';
import { KiwiClient } from '@/client';
import { SelectMenu, Button, CustomOptions } from '@/types/component';
import { EventList } from '@/types/event';

export class ComponentManager {
	private client: KiwiClient;
	public SelectMenus: Collection<string, SelectMenu>;
	public Buttons: Collection<string, Button>;

	constructor(client: KiwiClient) {
		this.client = client;
		this.SelectMenus = new Collection();
		this.Buttons = new Collection();

		this.client.on(
			EventList.InteractionCreate,
			this.onInteraction.bind(this)
		);
	}

	public registerSelectMenu(selectMenu: SelectMenu) {
		var customId = selectMenu.customId;
		this.SelectMenus.set(customId, selectMenu);
	}

	public registerButton(button: Button) {
		var customId = button.customId;
		this.Buttons.set(customId, button);
	}

	async onInteraction(interaction: MessageComponentInteraction) {
		if (!interaction.isMessageComponent()) return;

		const config: CustomOptions = {};
		for (const x of interaction.customId.split('&')) {
			const [key, value] = x.split('=');
			config[key] = value;
		}

		if (interaction.isAnySelectMenu()) {
			let selectMenu = this.SelectMenus.get(config.customId);
			if (!selectMenu) return;

			if (config.ownerId && config.ownerId != interaction.user.id) {
				interaction.reply({
					content: "This isn't yours",
					ephemeral: true,
				});
				return;
			}

			if (interaction.guildId) {
				if (!selectMenu.module?.default) {
					var isEnabled =
						await this.client.db.repos.guildModules.findOneBy({
							guildId: interaction.guildId,
							moduleId: selectMenu.module.id,
						});
					if (!isEnabled) {
						interaction.reply({
							content: `This select menu is disabled!`,
							ephemeral: true,
						});
						return;
					}
				}
				if (selectMenu.module.permissions) {
					var member = await interaction.guild.members.fetch(
						interaction.user.id
					);
					var hasPermission = false;
					for (var permission of selectMenu.module.permissions) {
						if (member.permissions.has(permission)) {
							hasPermission = true;
							break;
						}
					}
					if (!hasPermission) {
						interaction.reply({
							content: `You don't have permission to use this button!`,
							ephemeral: true,
						});
						return;
					}
				}
			}

			try {
				await selectMenu.execute(interaction, config, this.client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an issue!',
					ephemeral: true,
				});
			}
		} else if (interaction.isButton()) {
			let button = this.Buttons.get(config.customId);
			if (!button) return;

			if (config.ownerId && config.ownerId != interaction.user.id) {
				interaction.reply({
					content: "This isn't yours",
					ephemeral: true,
				});
				return;
			}

			if (interaction.guildId) {
				if (!button.module?.default) {
					var isEnabled =
						await this.client.db.repos.guildModules.findOneBy({
							guildId: interaction.guildId,
							moduleId: button.module.id,
						});
					if (!isEnabled) {
						interaction.reply({
							content: `This button is disabled!`,
							ephemeral: true,
						});
						return;
					}
				}
				if (button.module.permissions) {
					var member = await interaction.guild.members.fetch(
						interaction.user.id
					);
					var hasPermission = false;
					for (var permission of button.module.permissions) {
						if (member.permissions.has(permission)) {
							hasPermission = true;
							break;
						}
					}
					if (!hasPermission) {
						interaction.reply({
							content: `You don't have permission to use this button!`,
							ephemeral: true,
						});
						return;
					}
				}
			}

			try {
				await button.execute(interaction, config, this.client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an issue!',
					ephemeral: true,
				});
			}
		}
	}
}
