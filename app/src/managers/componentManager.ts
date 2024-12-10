import {
	Collection,
	Guild,
	MessageComponentInteraction,
	User,
} from 'discord.js';
import { KiwiClient } from '@/client';
import { SelectMenu, Button, CustomOptions } from '@/types/component';
import { EventList } from '@/types/event';
import { Module } from '@/types/module';

export class ComponentManager {
	private client: KiwiClient;
	public SelectMenus: Collection<string, SelectMenu>;
	public Buttons: Collection<string, Button>;

	public shortKeys: {
		[key: string]: string;
	};

	constructor(client: KiwiClient) {
		this.client = client;
		this.SelectMenus = new Collection();
		this.Buttons = new Collection();

		this.client.on(
			EventList.InteractionCreate,
			this.onInteraction.bind(this)
		);

		this.shortKeys = {
			customId: 'ci',
			ownerId: 'oi',
			module: 'mo',
			option: 'op',
		};
	}

	public getShortKey(value: string): string {
		return this.shortKeys[value] || value;
	}

	public getKeyFromShort(value: string): string {
		var key = Object.keys(this.shortKeys).find(
			(key) => this.shortKeys[key] === value
		);
		return key;
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
			var [key, value] = x.split('=');
			key = this.getKeyFromShort(key);
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
				var checks = await this.client.ModuleManager.checkGuild(
					interaction.guild,
					interaction.user,
					selectMenu.module
				);
				if (!checks.status) {
					interaction.reply({
						content: checks.response,
						ephemeral: true,
					});
					return;
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
				var checks = await this.client.ModuleManager.checkGuild(
					interaction.guild,
					interaction.user,
					button.module
				);
				if (!checks.status) {
					interaction.reply({
						content: checks.response,
						ephemeral: true,
					});
					return;
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
