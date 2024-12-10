import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { env } from '@/env';
import { KiwiClient } from '@/client';
import {
	PrefixCommand,
	SlashCommand,
	UserCommand,
	CommandOptions,
	ConfigOptionTypes,
} from '@/types/command';
import { Collection, Message, TextChannel } from 'discord.js';
import { EventList } from '@/types/event';

export class CommandManager {
	public client: KiwiClient;
	public PrefixCommands: Collection<string, PrefixCommand>;
	public SlashCommands: Collection<string, SlashCommand>;
	public UserCommands: Collection<string, UserCommand>;
	private RestAPI: REST;

	constructor(client: KiwiClient) {
		this.client = client;

		this.PrefixCommands = new Collection();
		this.SlashCommands = new Collection();
		this.UserCommands = new Collection();
		this.RestAPI = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

		this.client.on(
			EventList.InteractionCreate,
			this.onInteraction.bind(this)
		);
		this.client.on(EventList.MessageCreate, this.onMessage.bind(this));
	}

	loadPrefix(command: PrefixCommand) {
		this.PrefixCommands.set(command.config.name, command);
		for (let alias of command.config.aliases || []) {
			this.PrefixCommands.set(alias, command);
		}
	}

	loadSlash(command: SlashCommand) {
		this.SlashCommands.set(command.config.name, command);
	}

	loadUser(command: UserCommand) {
		this.UserCommands.set(command.config.name, command);
	}

	async register(commands: any[], guildId?: string) {
		if (!guildId) {
			this.RestAPI.put(Routes.applicationCommands(env.CLIENT_ID), {
				body: commands,
			});
		} else {
			this.RestAPI.put(
				Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
				{ body: commands }
			);
		}
	}

	async unregisterAll(guildId?: string) {
		try {
			if (!guildId) {
				this.RestAPI.put(Routes.applicationCommands(env.CLIENT_ID), {
					body: [],
				});
			} else {
				this.RestAPI.put(
					Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
					{ body: [] }
				);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async onInteraction(interaction: any) {
		if (interaction.isChatInputCommand()) {
			let command = this.SlashCommands.get(interaction.commandName);

			if (!command) return;

			if (interaction.guildId) {
				var checks = await this.client.ModuleManager.checkGuild(
					interaction.guild,
					interaction.user,
					command.module
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
				await command.execute(interaction, this.client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an issue!',
					ephemeral: true,
				});
			}
		} else if (interaction.isAutocomplete()) {
			let command = this.SlashCommands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.autocomplete(interaction, this.client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an issue!',
					ephemeral: true,
				}); // Fix this to respond in autocomplete
			}
		} else if (interaction.isUserContextMenuCommand()) {
			const command = this.UserCommands.get(interaction.commandName);

			if (!command) return;

			if (interaction.guildId) {
				var checks = await this.client.ModuleManager.checkGuild(
					interaction.guild,
					interaction.user,
					command.module
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
				await command.execute(interaction, this.client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: 'There is an issue!',
					ephemeral: true,
				});
			}
		}
	}

	async onMessage(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(env.PREFIX)) return;

		let textArgs = message.content
			.slice(env.PREFIX.length)
			.trim()
			.split(/ +/);
		let commandName = textArgs.shift()?.toLowerCase();
		if (!commandName) return;

		let command = this.PrefixCommands.get(commandName);
		if (!command) return;

		var channel = message.channel as TextChannel;

		if (command.config.autoDelete) {
			message.delete();
		}

		if (message.guildId) {
			var checks = await this.client.ModuleManager.checkGuild(
				message.guild,
				message.author,
				command.module
			);
			if (!checks.status) {
				await channel.send(checks.response);
				return;
			}
		}

		var commandOptions: CommandOptions = {
			commandName: commandName,
			auther: message.author.id,
			module: command.module,
			command: command,
		};

		var count = 0;
		var args = new Array();
		if (command.config.options) {
			for (let option of command.config.options) {
				if (!textArgs[count]) {
					channel.send({
						content: `You must provide a ${option.name}`,
					});
					return;
				}
				if (option.type === ConfigOptionTypes.TEXT) {
					args.push(textArgs[count]);
				} else if (option.type === ConfigOptionTypes.NUMBER) {
					var number = parseInt(textArgs[count]);
					if (isNaN(number)) {
						channel.send({
							content: `You must provide a valid number`,
						});
						return;
					}
					if (option.maxValue && number > option.maxValue) {
						channel.send({
							content: `You must provide a number less than ${option.maxValue}`,
						});
						return;
					}
					args.push(number);
				} else {
					var id = await this.client.getId(message, textArgs[count]);
					if (!id) {
						channel.send({
							content: `You must provide a valid ${option.name}`,
						});
						return;
					}

					var entry;
					if (option.type === ConfigOptionTypes.USER) {
						entry = await this.client.users.fetch(id);
						args.push(entry);
					} else if (option.type === ConfigOptionTypes.MEMBER) {
						entry = await message.guild?.members.fetch(id);
						args.push(entry);
					} else if (option.type === ConfigOptionTypes.CHANNEL) {
						entry = await message.guild?.channels.fetch(id);
						args.push(entry);
					} else if (option.type === ConfigOptionTypes.ROLE) {
						entry = await message.guild?.roles.fetch(id);
						args.push(entry);
					}
					if (!entry) {
						channel.send({
							content: `You must provide a valid ${option.name}`,
						});
						return;
					}
				}
				count++;
			}
		}

		try {
			await command.execute(
				this.client,
				message,
				commandOptions,
				...args
			);
		} catch (error) {
			console.error(error);
			await channel.send('There is an issue!');
		}
	}
}
