import { Plugin } from "./pluginTypes";

export function definePlugin(plugin: Plugin): Plugin {
    for (const event of (plugin?.events ?? [])) {
        event.pluginId = plugin.id;
    }

    for (const command of (plugin?.commands ?? [])) {
        command.pluginId = plugin.id;
    }

    return plugin;
}
