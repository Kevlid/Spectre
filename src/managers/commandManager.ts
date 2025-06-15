import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "@/env";
import { KiwiClient } from "@/client";
import { MessageCommand, PrefixCommand, SlashCommand, UserCommand } from "@/types/command";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Collection,
    Message,
    MessageContextMenuCommandInteraction,
    UserContextMenuCommandInteraction,
} from "discord.js";
import { EventList } from "@/types/event";

export class CommandManager {
    public client: KiwiClient;
    public PrefixCommands: Collection<string, PrefixCommand>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;
    public MessageCommands: Collection<string, MessageCommand>;
    private RestAPI: REST;

    constructor(client: KiwiClient) {
        this.client = client;

        this.PrefixCommands = new Collection();
        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
        this.MessageCommands = new Collection();
        this.RestAPI = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

        //this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));
        // Listen for slash command interactions
        this.client.on(EventList.InteractionCreate, async (interaction) => {
            if (!interaction.guild) return;
            if (interaction.isAutocomplete()) {
                await this._onAutocomplete(interaction);
            } else if (interaction.isChatInputCommand()) {
                await this._onSlashCommand(interaction);
            } else if (interaction.isUserContextMenuCommand()) {
                await this._onUserCommand(interaction);
            } else if (interaction.isMessageContextMenuCommand()) {
                // Handle message context menu commands if needed
                // Currently not implemented in this example
            }
        });
        this.client.on(EventList.MessageCreate, async (message: Message) => {
            if (message.author.bot || !message.guild) return;
            if (!message.content.startsWith(env.PREFIX)) return;
            await this._onMessage(message);
        });
    }

    loadPrefix(command: PrefixCommand) {
        this.PrefixCommands.set(command.config.name, command);
        for (let alias of command.config.aliases || []) {
            this.PrefixCommands.set(alias, command);
        }
    }

    loadSlash(command: SlashCommand) {
        this.SlashCommands.set(command.config.name, command);
    }

    loadUser(command: UserCommand) {
        this.UserCommands.set(command.config.name, command);
    }

    loadMessage(command: MessageCommand) {
        this.MessageCommands.set(command.config.name, command);
    }

    /* Register all commands */
    public async registerMany(
        commands: (PrefixCommand | SlashCommand | UserCommand)[],
        guildId?: string
    ): Promise<void> {
        try {
            // Use guild commands if a guildId is provided; otherwise, use global commands.
            if (!guildId) {
                this.RestAPI.put(Routes.applicationCommands(env.DISCORD_ID), {
                    body: commands,
                });
            } else {
                this.RestAPI.put(Routes.applicationGuildCommands(env.DISCORD_ID, guildId), {
                    body: commands,
                });
            }
            console.info(`Successfully registered ${commands.length} commands (${guildId ?? "global"})`);
        } catch (error: any) {
            console.error(`Failed to register ${commands.length} commands (${guildId ?? "global"})`);
        }
    }

    /* Register command */
    public async registerCommand(command: PrefixCommand | SlashCommand | UserCommand, guildId?: string): Promise<void> {
        const commandData = command.config;
        const safeCommandData = JSON.parse(
            JSON.stringify(commandData, (key, value) => (typeof value === "bigint" ? value.toString() : value))
        );

        try {
            // Use guild commands if a guildId is provided; otherwise, use global commands.
            if (guildId) {
                await this.RestAPI.post(Routes.applicationGuildCommands(env.DISCORD_ID, guildId), {
                    body: safeCommandData,
                });
            } else {
                await this.RestAPI.post(Routes.applicationCommands(env.DISCORD_ID), {
                    body: safeCommandData,
                });
            }
            console.info(`Successfully registered command ${commandData.name} (${guildId ?? "global"})`);
        } catch (error: any) {
            console.error(`Failed to register command ${commandData.name} (${guildId ?? "global"})`);
        }
    }

    /* Clear commands */
    public async clearCommands(guildId?: string): Promise<void> {
        try {
            if (guildId) {
                await this.RestAPI.put(Routes.applicationGuildCommands(env.DISCORD_ID, guildId));
                console.info(`Successfully cleared commands for guild ${guildId}`);
            } else {
                await this.RestAPI.put(Routes.applicationCommands(env.DISCORD_ID));
                console.info(`Successfully cleared global commands`);
            }
        } catch (error: any) {
            console.error(`Failed to clear commands (${guildId ?? "global"})`);
        }
    }

    private async _onAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const command = this.SlashCommands.get(interaction.commandName);
        if (!command) return;

        if (!command.autocomplete) {
            await interaction.respond([
                {
                    name: "No autocomplete available for this command.",
                    value: "error.no_autocomplete",
                },
            ]);
            return;
        }

        await command.autocomplete(this.client, interaction).catch((error) => {
            console.error(`Error in autocomplete for slash command ${interaction.commandName}:`, error);
            interaction.respond([
                {
                    name: "Error in autocomplete",
                    value: "error.autocomplete_failed",
                },
            ]);
        });
    }

    private async _onSlashCommand(interaction: ChatInputCommandInteraction) {
        const command = this.SlashCommands.get(interaction.commandName);
        if (!command) return;

        if (command.beforeExecute) {
            const beforeSuccess = await command.beforeExecute(this.client, interaction).catch((error) => {
                console.error(`Error in beforeExecute for slash command ${interaction.commandName}:`, error);
            });
            if (beforeSuccess === false) {
                await interaction.reply({
                    content: "Command execution was cancelled",
                    ephemeral: true,
                });
                return;
            }
        }
        await command.execute(this.client, interaction).catch((error) => {
            console.error(`Error executing slash command ${interaction.commandName}:`, error);
        });
        if (command.afterExecute) {
            await command.afterExecute(this.client, interaction).catch((error) => {
                console.error(`Error in afterExecute for slash command ${interaction.commandName}:`, error);
            });
        }
    }

    private async _onUserCommand(interaction: UserContextMenuCommandInteraction) {
        const command = this.UserCommands.get(interaction.commandName);
        if (!command) return;

        if (command.beforeExecute) {
            const beforeSuccess = await command.beforeExecute(interaction, this.client).catch((error) => {
                console.error(`Error in beforeExecute for user command ${interaction.commandName}:`, error);
            });
            if (beforeSuccess === false) {
                await interaction.reply({
                    content: "Command execution was cancelled",
                    ephemeral: true,
                });
                return;
            }
        }
        await command.execute(interaction, this.client).catch((error) => {
            console.error(`Error executing user command ${interaction.commandName}:`, error);
            interaction.reply({
                content: "There was an error executing this command.",
                ephemeral: true,
            });
        });
        if (command.afterExecute) {
            await command.afterExecute(interaction, this.client).catch((error) => {
                console.error(`Error in afterExecute for user command ${interaction.commandName}:`, error);
            });
        }
    }

    private async _onMessageCommand(interaction: MessageContextMenuCommandInteraction): Promise<void> {
        const command = this.MessageCommands.get(interaction.commandName);
        if (!command) return;

        if (command.beforeExecute) {
            const beforeSuccess = await command.beforeExecute(interaction, this.client).catch((error) => {
                console.error(`Error in beforeExecute for message command ${interaction.commandName}:`, error);
            });
            if (beforeSuccess === false) {
                await interaction.reply({
                    content: "Command execution was cancelled",
                    ephemeral: true,
                });
                return;
            }
        }
        await command.execute(interaction, this.client).catch((error) => {
            console.error(`Error executing message command ${interaction.commandName}:`, error);
            interaction.reply({
                content: "There was an error executing this command.",
                ephemeral: true,
            });
        });
        if (command.afterExecute) {
            await command.afterExecute(interaction, this.client).catch((error) => {
                console.error(`Error in afterExecute for message command ${interaction.commandName}:`, error);
            });
        }
    }

    private async _onMessage(message: Message): Promise<void> {
        const args = message.content.slice(env.PREFIX.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command =
            this.PrefixCommands.get(commandName) ||
            this.PrefixCommands.find((cmd) => cmd.config.aliases?.includes(commandName));
        if (!command) return;

        if (command.beforeExecute) {
            const beforeSuccess = await command.beforeExecute(this.client, message, ...args).catch((error) => {
                console.error(`Error in beforeExecute for prefix command ${commandName}:`, error);
            });
            if (beforeSuccess === false) {
                await message.reply("Command execution was cancelled.");
                return;
            }
        }
        await command.execute(this.client, message, ...args).catch((error) => {
            console.error(`Error executing prefix command ${commandName}:`, error);
            message.reply("There was an error executing this command.");
        });
        if (command.afterExecute) {
            await command.afterExecute(this.client, message, ...args).catch((error) => {
                console.error(`Error in afterExecute for prefix command ${commandName}:`, error);
            });
        }
    }
}
