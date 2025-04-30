import { env } from "./env";

import { dataSource } from "./datasource";

import { DiscordClient } from "./client";
import { Qewi, PluginTypes } from "@/qewi";

import { plugins } from "./plugins/plugins";

async function bootstrap() {
    await dataSource.initialize();

    const client = new DiscordClient();
    await client.login(env.CLIENT_TOKEN);

    const qewi = new Qewi(client, {
        token: env.CLIENT_TOKEN,
    });

    const GlobalPlugins = plugins.filter((plugin) => plugin.type === PluginTypes.Global);
    const GuildPlugins = plugins.filter((plugin) => plugin.type === PluginTypes.Guild);

    // Clear all of the old commands
    await qewi.commandHandler.clearCommands();

    for (let plugin of GlobalPlugins) {
        await qewi.pluginHandler.loadGlobalPlugin(plugin.id, plugin);
        console.log(`Successfully Loaded Global Plugin '${plugin.id}'`);
    }

    for (let command of qewi.commandHandler.globalCommands.values()) {
        console.log(`Successfully Loaded Global Command '${command.config.name}'`);
    }

    for (const [guildId, guild] of await client.guilds.fetch()) {
        // Clear all the old commands
        await qewi.commandHandler.clearCommands(guildId);

        for (let plugin of GuildPlugins) {
            await qewi.pluginHandler.loadGuildPlugin(guildId, plugin.id, plugin);
            console.log(`Successfully Loaded Guild Plugin '${plugin.id}' for Guild '${guild.name}' (${guildId})`);
        }
    }
}

bootstrap();
