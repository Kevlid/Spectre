import { definePlugin, PluginTypes } from "@/qewi";

import { pingCommand } from "./commands/ping";

import { messageCreate } from "./event/messageCreate";

export const configPlugin = definePlugin({
    id: "Config",
    type: PluginTypes.Guild,

    commands: [pingCommand],
    events: [messageCreate],
});
