import { Collection, Guild, User } from 'discord.js';
import { KiwiClient } from '@/client';
import { Module } from '@/types/module';
import { env } from '@/env';

export class ModuleManager {
	private client: KiwiClient;
	public Modules: Collection<string, Module>;

	constructor(client: KiwiClient) {
		this.client = client;
		this.Modules = new Collection();
	}

	load(module: Module) {
		this.Modules.set(module.id, module);
		if (module.events) {
			for (let event of module.events) {
				event.module = module;
				this.client.EventManager.load(event);
			}
		}
		if (module.prefixCommands) {
			for (let prefixCommand of module.prefixCommands) {
				prefixCommand.module = module;
				this.client.CommandManager.loadPrefix(prefixCommand);
			}
		}
		if (module.slashCommands) {
			for (let slashCommand of module.slashCommands) {
				slashCommand.module = module;
				this.client.CommandManager.loadSlash(slashCommand);
			}
		}
		if (module.userCommands) {
			for (let userCommand of module.userCommands) {
				userCommand.module = module;
				this.client.CommandManager.loadUser(userCommand);
			}
		}
		if (module.selectMenus) {
			for (let selectMenu of module.selectMenus) {
				selectMenu.module = module;
				this.client.ComponentManager.registerSelectMenu(selectMenu);
			}
		}
		if (module.buttons) {
			for (let button of module.buttons) {
				button.module = module;
				this.client.ComponentManager.registerButton(button);
			}
		}
		if (module.schedules) {
			for (let schedule of module.schedules) {
				schedule.module = module;
				this.client.ScheduleManager.register(schedule);
			}
		}
	}

	async register() {
		for (var eventKey of this.client.EventManager.Events.keys()) {
			this.client.EventManager.register(eventKey);
		}
	}

	async registerCommands(commands: any[], guildId?: string) {
		var cmds = [];
		for (let command of commands) {
			cmds.push(command.config);
		}
		this.client.CommandManager.register(cmds, guildId);
	}

	public async checkGuild(guild: Guild, user: User, module: Module) {
		if (module.developerOnly && env.STAFF_USERS.includes(user.id)) {
			return {
				status: true,
			};
		} else if (module.developerOnly) {
			return {
				response: `You are not a developer!`,
				status: false,
			};
		}

		if (!module?.default) {
			var isEnabled = await this.client.db.repos.guildModules.findOneBy({
				guildId: guild.id,
				moduleId: module.id,
			});
			if (!isEnabled) {
				return {
					response: `This module is disabled!`,
					status: false,
				};
			}
		}
		if (module.permissions) {
			var member = await guild.members.fetch(user.id);
			var hasPermission = false;
			for (var permission of module.permissions) {
				if (member.permissions.has(permission)) {
					hasPermission = true;
					break;
				}
			}
			if (!hasPermission) {
				return {
					response: `You don't have permission to use this module!`,
					status: false,
				};
			}
		}

		return {
			status: true,
		};
	}
}
