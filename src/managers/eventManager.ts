import { Collection } from "discord.js";
import { KiwiClient } from "@/client";
import { Event, EventList } from "@/types/event";

import { ClientModules } from "@/modules/modules";

export class EventManager {
    private client: KiwiClient;
    public Events: Collection<string, Event[]>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.Events = new Collection();
        this.client.on(EventList.Ready, () => this.onReady(this.client));
    }

    private async onReady(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);

        for (let module of ClientModules) {
            client.ModuleManager.load(module);
        }

        client.ModuleManager.register();

        for (let guild of await client.guilds.fetch()) {
            await client.ModuleManager.registerCommands(
                [...client.CommandManager.SlashCommands.values(), ...client.CommandManager.UserCommands.values()],
                guild[0]
            );
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
                await event.execute(this.client, ...args).catch((error) => {
                    console.error(`Error executing event ${event.name}:`, error);
                });
            });
        });
    }
}
