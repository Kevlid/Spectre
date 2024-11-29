import { Collection } from 'discord.js';
import { KiwiClient } from '@/client';
import { Event, EventList } from '@/types/event';

import { ClientModules } from '@/modules/modules';

export class EventManager {
	private client: KiwiClient;
	public Events: Collection<string, Event[]>;

	constructor(client: KiwiClient) {
		this.client = client;
		this.Events = new Collection();
		this.client.on(EventList.Ready, this.onReady.bind(this));
	}

	private async onReady(client: KiwiClient) {
		console.log(`${client.user?.username} is Online`);

		for (let module of ClientModules) {
			client.ModuleManager.load(module);
		}

		client.ModuleManager.register();

		client.ModuleManager.registerCommands([
			...client.CommandManager.SlashCommands.values(),
			...client.CommandManager.UserCommands.values(),
		]);

		for (let guild of await client.guilds.fetch()) {
			client.emit(EventList.GuildReady, await guild[1].fetch());
		}
	}

	load(event: Event) {
		var EventArray = this.Events.get(event.name);
		if (!EventArray) {
			EventArray = [];
		}
		EventArray.push(event);
		this.Events.set(event.name, EventArray);
	}

	register(eventKey) {
		console.log(`Registering Event: ${eventKey}`);
		this.client.on(eventKey, async (...args: any[]) => {
			var events = this.Events.get(eventKey);
			if (!events) return;
			events.forEach(async (event) => {
				console.log(`Event: ${event.name}`);
				if (event.module?.default) {
					event.execute(this.client, ...args);
				} else if (event.global) {
					event.execute(this.client, ...args);
				} else {
					var guildId = await event.getGuildId(...args);
					var isEnabled = await this.client.db.isModuleEnabled(
						guildId,
						event.module.id
					);
					if (isEnabled) event.execute(this.client, ...args);
				}
			});
		});
	}
}
