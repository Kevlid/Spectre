import { defineCommand, CommandTypes, CommandContexts, IntegrationTypes, CommandOptionTypes } from "@/qewi";

export const configCommand = defineCommand({
    config: {
        name: "config",
        description: "..",
        type: CommandTypes.ChatInput,
        options: [
            {
                name: "update-channel",
                description: "Update the channel and key",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "key",
                        description: "The key to set",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "channel",
                        description: "The channel to update",
                        type: CommandOptionTypes.Channel,
                        required: true,
                    },
                ],
            },
            {
                name: "update-role",
                description: "Update the role and key",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "key",
                        description: "The key to set",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "role",
                        description: "The role to update",
                        type: CommandOptionTypes.Role,
                        required: true,
                    },
                ],
            },
        ],
    },

    trigger: async function (ctx, data) {
        console.log(data.interaction.options.getString("key"));
        data.interaction.reply("Config command triggered");
    },
});
