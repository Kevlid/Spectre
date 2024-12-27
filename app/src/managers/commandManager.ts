import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "@/env";
import { KiwiClient } from "@/client";
import {
	PrefixCommand,
	SlashCommand,
	UserCommand,
	CommandOptions,
	ConfigOptionTypes,
} from "@/types/command";
import { Collection, Message, TextChannel } from "discord.js";
import { EventList } from "@/types/event";

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
		this.RestAPI = new REST({ version: "10" }).setToken(env.CLIENT_TOKEN);

		this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));
		this.client.on(EventList.MessageCreate, this.onMessage.bind(this));
	}

	public async getUserId(message: Message, value: string) {
		if (value.startsWith("<@") && value.endsWith(">") && !value.startsWith("<@&")) {
			value = value.slice(2, -1);
			if (value.startsWith("!")) {
				value = value.slice(1);
			}
		} else if (value.includes("u") && message.reference) {
			var messageReference = await message.fetchReference();
			value = messageReference.author.id;
		} else if (!/^\d{17,19}$/.test(value)) {
			value = null;
		}
		return value;
	}

	public async getRoleId(message: Message, value: string) {
		if (value.startsWith("<@&") && value.endsWith(">")) {
			return value.slice(3, -1);
		} else if (/^\d{17,19}$/.test(value)) {
			return value;
		} else {
			var role = message.guild?.roles.cache.find((role) =>
				role.name
					.toLocaleLowerCase()
					.replace(/\s+/g, "")
					.includes(value.toLocaleLowerCase().replace(/\s+/g, ""))
			);
			if (role) {
				return role.id;
			} else {
				return null;
			}
		}
	}

	public getChannelId(message: Message, value: string) {
		if (value.startsWith("<#") && value.endsWith(">")) {
			return value.slice(2, -1);
		} else if (/^\d{17,19}$/.test(value)) {
			return value;
		} else {
			var channel = message.guild?.channels.cache.find((channel) =>
				channel.name
					.toLocaleLowerCase()
					.replace(/\s+/g, "")
					.includes(value.toLocaleLowerCase().replace(/\s+/g, ""))
			);
			if (channel) {
				return channel.id;
			} else {
				return null;
			}
		}
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
			this.RestAPI.put(Routes.applicationGuildCommands(env.CLIENT_ID, guildId), {
				body: commands,
			});
		}
	}

	async unregisterAll(guildId?: string) {
		try {
			if (!guildId) {
				this.RestAPI.put(Routes.applicationCommands(env.CLIENT_ID), {
					body: [],
				});
			} else {
				this.RestAPI.put(Routes.applicationGuildCommands(env.CLIENT_ID, guildId), {
					body: [],
				});
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
					content: "There is an issue!",
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
					content: "There is an issue!",
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
					content: "There is an issue!",
					ephemeral: true,
				});
			}
		}
	}

	async onMessage(message: Message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(env.PREFIX)) return;

		let textArgs = message.content.slice(env.PREFIX.length).trim().split(/ +/);
		let commandName = textArgs.shift()?.toLowerCase();
		if (!commandName) return;

		let command = this.PrefixCommands.get(commandName);
		if (!command) return;

		var options: CommandOptions = {
			commandName: commandName,
			auther: message.author.id,
			module: command.module,
			command: command,
			channel: message.channel as TextChannel,
		};

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
				await options.channel.send(checks.response);
				return;
			}
		}

		var count = 0;
		var args = new Array();
		if (command.config.options) {
			for (let option of command.config.options) {
				if (!textArgs[count]) {
					options.channel.send({
						content: `You must provide a ${option.name}`,
					});
					return;
				}

				if (option.type === ConfigOptionTypes.TEXT) {
					if (option.includeAfter) {
						args.push(textArgs.slice(count).join(" "));
					} else {
						args.push(textArgs[count]);
					}
				} else if (option.type === ConfigOptionTypes.NUMBER) {
					var number = parseInt(textArgs[count]);
					if (isNaN(number)) {
						options.channel.send({
							content: `You must provide a valid number`,
						});
						return;
					}
					if (option.maxValue && number > option.maxValue) {
						options.channel.send({
							content: `You must provide a number less than ${option.maxValue}`,
						});
						return;
					}
					args.push(number);
				}
				if (option.type === ConfigOptionTypes.USER) {
					var userId = await this.getUserId(message, textArgs[count]);
					if (!userId) {
						options.channel.send({
							content: `You must provide a valid user`,
						});
						return;
					}
					var user = await this.client.users.fetch(userId);
					if (!user) {
						options.channel.send({
							content: `You must provide a valid user`,
						});
						return;
					}
					args.push(user);
				} else if (option.type === ConfigOptionTypes.MEMBER) {
					var memberId = await this.getUserId(message, textArgs[count]);
					if (!memberId) {
						options.channel.send({
							content: `You must provide a valid member`,
						});
						return;
					}
					var member = await message.guild?.members.fetch(memberId);
					if (!member) {
						options.channel.send({
							content: `You must provide a valid member`,
						});
						return;
					}
					args.push(member);
				} else if (option.type === ConfigOptionTypes.CHANNEL) {
					var channelId = this.getChannelId(message, textArgs[count]);
					if (!channelId) {
						options.channel.send({
							content: `You must provide a valid channel`,
						});
						return;
					}
					var fetchedChannel = await message.guild?.channels.fetch(channelId);
					if (!fetchedChannel) {
						options.channel.send({
							content: `You must provide a valid channel`,
						});
						return;
					}
					args.push(fetchedChannel);
				} else if (option.type === ConfigOptionTypes.ROLE) {
					var roleId = await this.getRoleId(message, textArgs[count]);
					if (!roleId) {
						options.channel.send({
							content: `You must provide a valid role`,
						});
						return;
					}
					var fetchedRole = await message.guild?.roles.fetch(roleId);
					if (!fetchedRole) {
						options.channel.send({
							content: `You must provide a valid role`,
						});
						return;
					}
					args.push(fetchedRole);
				}
				count++;
			}
		}

		try {
			await command.execute(this.client, message, options, ...args);
		} catch (error) {
			console.error(error);
			await options.channel.send("There is an issue!");
		}
	}
}
