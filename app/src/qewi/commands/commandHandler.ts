import { Qewi } from "../qewi";
import { PluginHandler } from "../plugins/pluginHandler";
import { Command, Context, Data } from "./commandTypes";
import { ChatInputCommandInteraction, GuildMember, Routes } from "discord.js";
import axios from "axios";

export class CommandHandler {
    public globalCommands = new Map<string, Command>();
    public guildCommands = new Map<string, Map<string, Command>>();

    private qewi: Qewi;
    private pluginHandler: PluginHandler;
    constructor(qewi: Qewi) {
        this.qewi = qewi;
        this.pluginHandler = qewi.pluginHandler;

        // Listen for slash command interactions
        this.qewi.client.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand()) {
                await this._onSlashCommand(interaction);
            }
        });
    }

    private async _onSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        const commandId = interaction.commandName;
        const command = this.getCommand(commandId, interaction.guildId);
        if (!command) return;

        const plugin = this.pluginHandler.getPlugin(command.pluginId, interaction.guildId);

        const ctx: Context = {
            qewi: this.qewi,
            plugin: plugin,
            command: command,
            guildId: interaction.guildId,
        };

        const data: Data = {
            interaction: interaction,
            guild: interaction.guild,
            authorId: interaction.user.id,
        };

        if (!this._isAllowed(ctx, data)) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }

        if (command.beforeTrigger) {
            await command.beforeTrigger(ctx, data);
        }
        await command.trigger(ctx, data);
        if (command.afterTrigger) {
            await command.afterTrigger(ctx, data);
        }
    }

    private _isAllowed(ctx: Context, data: Data): boolean {
        const member = data.interaction.member as GuildMember;
        if (!member) return false;

        let requiredRoles: string[] = [];
        let requiredPermissions: any[] = [];

        if (ctx.plugin.default) {
            requiredRoles = ctx.plugin.default.roles;
            requiredPermissions = ctx.plugin.default.permissions;
        }

        if (ctx.command.default) {
            requiredRoles = ctx.command.default.roles;
            requiredPermissions = ctx.command.default.permissions;
        }

        let hasAccess = false;
        if (requiredRoles.length > 0) {
            // Check roles
            for (const roleId of requiredRoles) {
                if (member.roles.cache.has(roleId)) {
                    hasAccess = true;
                    break;
                }
            }
        } else if (requiredPermissions.length > 0) {
            // Check permissions
            for (const permission of requiredPermissions) {
                if (member.permissions.has(permission)) {
                    hasAccess = true;
                    break;
                }
            }
        } else {
            hasAccess = true;
        }

        return hasAccess;
    }

    /* Register command */
    private async _registerCommand(command: Command, guildId?: string): Promise<void> {
        const commandData = command.config;

        try {
            // Use guild commands if a guildId is provided; otherwise, use global commands.
            if (guildId) {
                await this.qewi.rest.post(Routes.applicationGuildCommands(this.qewi.client.user.id, guildId), {
                    body: commandData,
                });
            } else {
                await this.qewi.rest.post(Routes.applicationCommands(this.qewi.client.user.id), {
                    body: commandData,
                });
            }
            console.info(`Successfully registered command ${commandData.name} (${guildId ?? "global"})`);
        } catch (error: any) {
            console.error(`Failed to register command ${commandData.name} (${guildId ?? "global"})`);
        }
    }

    /* Command lookup and management (global/guild) remains the same */

    public getCommand(commandId: string, guildId?: string | null): Command | null {
        let command: Command | null = this.getGlobalCommand(commandId);
        if (!command && guildId) {
            command = this._getGuildCommand(guildId, commandId);
        }
        return command;
    }

    public getGlobalCommand(commandId: string): Command | null {
        return this.globalCommands.get(commandId) || null;
    }

    public loadGlobalCommand(commandId: string, command: Command): void {
        if (this.getGlobalCommand(commandId)) {
            throw new Error(`Command ${commandId} is already loaded globally`);
        } else {
            this.globalCommands.set(commandId, command);
            this._registerCommand(command);
        }
    }

    public unloadGlobalCommand(commandId: string): void {
        const command = this.getGlobalCommand(commandId);
        if (command) {
            this.globalCommands.delete(commandId);
        } else {
            throw new Error(`Command ${commandId} is not loaded globally`);
        }
    }

    private _getGuildCommands(guildId: string): Map<string, Command> {
        let commandsMap = this.guildCommands.get(guildId);
        if (!commandsMap) {
            commandsMap = new Map<string, Command>();
        }
        return commandsMap;
    }

    private _getGuildCommand(guildId: string, commandId: string): Command | null {
        return this._getGuildCommands(guildId).get(commandId) || null;
    }

    private _setGuildCommand(guildId: string, commandId: string, command: Command): void {
        const guildCommands = this._getGuildCommands(guildId);
        guildCommands.set(commandId, command);
        this.guildCommands.set(guildId, guildCommands);
    }

    public loadGuildCommand(guildId: string, commandId: string, command: Command): void {
        if (this._getGuildCommand(guildId, commandId)) {
            throw new Error(`Command ${commandId} is already loaded in guild ${guildId}`);
        } else {
            this._setGuildCommand(guildId, commandId, command);
            this._registerCommand(command, guildId);
        }
    }

    public unloadGuildCommand(guildId: string, commandId: string): void {
        const command = this._getGuildCommand(guildId, commandId);
        if (!command) {
            throw new Error(`Command ${commandId} is not loaded in guild ${guildId}`);
        } else {
            this._getGuildCommands(guildId).delete(commandId);
        }
    }
}
