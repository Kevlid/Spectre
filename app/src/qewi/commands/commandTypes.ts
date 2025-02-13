import { Qewi } from "../qewi";
import { Default } from "../types";
import { Plugin } from "../plugins/pluginTypes";

import { ChatInputCommandInteraction, Guild } from "discord.js";

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
    id: string;
    description: string;
    pluginId?: string;
    type: CommandTypes;

    default?: Default;

    /* TODO: Add in command options for both slash commands and prefix commands */
    /* TODO: Add in both command so its slash and prefix */

    options?: Array<CommandOption>;

    beforeTrigger?: CommandPayload;
    trigger: CommandPayload;
    afterTrigger?: CommandPayload;
}

export enum CommandTypes {
    ChatInput = 1,
    User = 3,
    Message = 3,
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

export enum CommandOptionTypes {}
