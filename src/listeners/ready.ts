import { ApplyOptions } from "@sapphire/decorators";
import { Listener, Events } from "@sapphire/framework";
import { Client } from "discord.js";

@ApplyOptions<Listener.Options>({
    event: Events.ClientReady,
    name: "ready",
    once: true,
})
export class UserEvent extends Listener<typeof Events.ClientReady> {
    public override run(client: Client) {
        const { username, id } = client.user!;
        this.container.logger.info(`Successfully logged in as ${username} (${id})`);
        this.container.logger.info(
            `Ready to serve ${client.guilds.cache.size} guilds and ${client.users.cache.size} users.`
        );
        this.container.logger.info(`Prefix: ${client.options.defaultPrefix ?? "?"}`);
        this.container.logger.info(`Shard Count: ${client.shard?.count ?? 1}`);
        this.container.logger.info(`Shard ID: ${client.shard?.ids[0] ?? "N/A"}`);
        this.container.logger.info(`Node Environment: ${process.env.NODE_ENV ? "Development" : "Production"}`);
        for (const guild of client.guilds.cache.values()) {
            this.container.logger.info(`- Guild: ${guild.name} (${guild.id})`);
        }
        this.printStoreDebugInformation();
    }

    private printStoreDebugInformation() {
        const { client, logger } = this.container;
        const stores = [...client.stores.values()];
        const last = stores.pop()!;

        logger.info(`Loaded ${stores.length} stores:`);
        for (const store of stores) {
            logger.info(`- ${store.name} (${store.size} items)`);
            for (const item of store.entries()) {
                logger.debug(`  - ${item[0]}: ${item[1].name}`);
            }
        }
        logger.info(`- ${last.name} (${last.size} items)`);
        for (const item of last.entries()) {
            logger.debug(`  - ${item[0]}: ${item[1].name}`);
        }
        logger.info(
            `Total: ${stores.reduce((acc, store) => acc + store.size, 0) + last.size} items across all stores.`
        );
    }
}
