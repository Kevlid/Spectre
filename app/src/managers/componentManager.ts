import { Collection, Guild, MessageComponentInteraction, User } from "discord.js";
import { KiwiClient } from "@/client";
import { SelectMenu, Button, CustomOptions } from "@/types/component";
import { EventList } from "@/types/event";
import { Module } from "@/types/module";

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

		this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));

		this.shortKeys = {
			customId: "ci",
			ownerId: "oi",
			module: "mo",
			option: "op",
			userId: "ui",
			memberId: "mi",
		};
	}

	public getShortKey(value: string): string {
		return this.shortKeys[value] || value;
	}

	public getKeyFromShort(key: string): string {
		key = Object.keys(this.shortKeys).find((newKey) => this.shortKeys[newKey] === key);
		return key;
	}

	public createCustomId(options: CustomOptions): string {
		var customId = new Array<string>();
		for (var [key, value] of Object.entries(options)) {
			if (customId.includes("&")) continue;
			if (!key || !value) continue;
			key = this.getShortKey(key);
			customId.push(`${key}=${value}`);
		}
		return customId.join("&");
	}

	public decodeCustomId(customId: string): CustomOptions {
		let config = {};
		for (const x of customId.split("&")) {
			let [key, value] = x.split("=");
			key = this.getKeyFromShort(key) ?? key;
			config[key] = value;
		}
		return config;
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

		var config = await this.decodeCustomId(interaction.customId);

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
					content: "There is an issue!",
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
					content: "There is an issue!",
					ephemeral: true,
				});
			}
		}
	}
}
