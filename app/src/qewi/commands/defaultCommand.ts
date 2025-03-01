import { CommandTypes, CommandOptionTypes, Command } from "./commandTypes";
import { defineCommand } from "./defineCommand";
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";

const configCommand = defineCommand({
    config: {
        name: "config",
        description: "Manage configuration for plugins",
        type: CommandTypes.ChatInput,
        default_member_permissions: PermissionFlagsBits.Administrator,
        options: [
            {
                name: "string",
                description: "Configure a string value",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "plugin",
                        description: "Plugin name",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "tags",
                        description: "Tags for the configuration",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "key",
                        description: "Configuration key",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "value",
                        description: "Configuration value",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                ],
            },
            {
                name: "channel",
                description: "Configure a channel value",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "plugin",
                        description: "Plugin name",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "tags",
                        description: "Tags for the configuration",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "key",
                        description: "Configuration key",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "value",
                        description: "Channel value",
                        type: CommandOptionTypes.Channel,
                        required: true,
                    },
                ],
            },
            {
                name: "role",
                description: "Configure a role value",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "plugin",
                        description: "Plugin name",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "tags",
                        description: "Tags for the configuration",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "key",
                        description: "Configuration key",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "value",
                        description: "Role value",
                        type: CommandOptionTypes.Role,
                        required: true,
                    },
                ],
            },
            {
                name: "boolean",
                description: "Configure a boolean value",
                type: CommandOptionTypes.SubCommand,
                options: [
                    {
                        name: "plugin",
                        description: "Plugin name",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "tags",
                        description: "Tags for the configuration",
                        type: CommandOptionTypes.String,
                        required: true,
                        autocomplete: true,
                    },
                    {
                        name: "key",
                        description: "Configuration key",
                        type: CommandOptionTypes.String,
                        required: true,
                    },
                    {
                        name: "value",
                        description: "Boolean value",
                        type: CommandOptionTypes.Boolean,
                        required: true,
                    },
                ],
            },
        ],
    },

    autocomplete: async function (ctx, data, interaction): Promise<void> {
        const focused = interaction.options.getFocused(true);

        switch (focused.name) {
            case "plugin": {
                var plugins = await ctx.qewi.pluginHandler.getGuildPlugins(interaction.guildId);
                console.log(plugins, 1011);
                //const pluginOptions = plugins.map(plugin => ({ name: plugin, value: plugin }));

                //await interaction.respond(pluginOptions);
            }

            case "tags": {
            }
        }
    },

    trigger: async function (ctx, data, interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand();
        const pluginName = interaction.options.getString("plugin");
        const tags = interaction.options.getString("tags");
        const key = interaction.options.getString("key");
        let value: any;

        // Parse the value based on the subcommand type.
        switch (subcommand) {
            case "string":
                value = interaction.options.getString("value");
                break;
            case "channel":
                value = interaction.options.getChannel("value");
                break;
            case "role":
                value = interaction.options.getRole("value");
                break;
            case "boolean":
                value = interaction.options.getBoolean("value");
                break;
            default:
                await interaction.reply("Invalid configuration type.");
        }

        await interaction.reply(
            `Configuration for plugin "${pluginName}" has been updated. (Key: ${key}, Value: ${value}, Tags: ${tags})`
        );
    },
});

export const defaultGlobalCommands: Array<Command> = [];
export const defaultGuildCommands: Array<Command> = [configCommand];
