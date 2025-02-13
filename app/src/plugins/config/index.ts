import { definePlugin, PluginTypes } from "@/qewi";

import { messageCreate } from "./event/messageCreate";

export const configPlugin = definePlugin({
    id: "Config",
    type: PluginTypes.Guild,

    events: [messageCreate],
});
