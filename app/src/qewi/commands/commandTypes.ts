import { Qewi } from "../qewi";
import { Default } from "../types";
import { Plugin } from "../plugins/pluginTypes";

import { ChatInputCommandInteraction, Guild, PermissionResolvable } from "discord.js";

type CommandPayload = (ctx: Context, data: Data) => Promise<void> | void;

export interface Context {
    qewi: Qewi;
    plugin: Plugin;
    command: Command;
    guildId: string;
}

export interface Data {
    interaction: ChatInputCommandInteraction;
    guild: Guild;
    authorId: string;
}

export interface Command {
    config: CommandConfig;
    pluginId?: string;

    default?: Default;

    beforeTrigger?: CommandPayload;
    trigger: CommandPayload;
    afterTrigger?: CommandPayload;
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
    channelTypes?: Array<string>;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
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
