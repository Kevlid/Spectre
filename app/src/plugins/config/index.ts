import { definePlugin, PluginTypes } from "@/qewi";

import { configCommand } from "./commands/config";
import { messageCreate } from "./event/messageCreate";

export const configPlugin = definePlugin({
    id: "Config",
    type: PluginTypes.Guild,

    commands: [configCommand],
    events: [messageCreate],
});
