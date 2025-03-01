import { Qewi } from "../qewi";
import { Default } from "../types";
import { Plugin } from "../plugins/pluginTypes";

import { AutocompleteInteraction, ChatInputCommandInteraction, Guild, PermissionResolvable } from "discord.js";

export type Interactions = AutocompleteInteraction | CommandInteractions;
export type CommandInteractions = ChatInputCommandInteraction;

export interface Context {
    qewi: Qewi;
    plugin: Plugin;
    command: Command;
    guild: Guild;
}

export interface Data {
    guildId: string;
    authorId: string;
}

export interface Command {
    config: CommandConfig;
    pluginId?: string;

    default?: Default;

    autocomplete?: (ctx: Context, data: Data, interaction: AutocompleteInteraction) => Promise<void> | void;

    beforeTrigger?: (ctx: Context, data: Data, interaction: CommandInteractions) => Promise<void> | void;
    trigger: (ctx: Context, data: Data, interaction: CommandInteractions) => Promise<void> | void;
    afterTrigger?: (ctx: Context, data: Data, interaction: CommandInteractions) => Promise<void> | void;
}

export interface CommandConfig {
    name: string;
    description: string;
    type: CommandTypes;
    default_member_permissions?: PermissionResolvable;
    contexts?: Array<CommandContexts>;
    integration_types?: Array<IntegrationTypes>;
    options?: Array<CommandOption>;
}

export enum CommandTypes {
    ChatInput = 1,
    User = 3,
    Message = 3,
}

export enum CommandContexts {
    Guild = 0,
    BotDM = 1,
    PrivateChannel = 2,
}

export enum IntegrationTypes {
    Guild = 0,
    User = 1,
}

export interface CommandOption {
    type: CommandOptionTypes;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<{ name: string; value: string }>;
    options?: Array<CommandOption>;
    channel_types?: Array<string>;
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export enum CommandOptionTypes {
    SubCommand = 1,
    SubCommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10,
    Attachment = 11,
}
