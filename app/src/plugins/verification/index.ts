import { definePlugin, PluginTypes, PluginSettingsTypes } from "@/qewi";

export const verificationPlugin = definePlugin({
    id: "Verification",
    type: PluginTypes.Guild,

    settings: {
        pendingChannel: {
            types: [PluginSettingsTypes.String, PluginSettingsTypes.Null],
            default: null,
        },
    },

    commands: [],
    events: [],
});
