import { KiwiClient } from "@/client";
import { Module } from "./module";

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    Message,
    User,
    GuildMember,
    Channel,
    Role,
    TextChannel,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
} from "discord.js";

export interface PrefixCommand {
    module?: Module | null;
    config: {
        name: string;
        description?: string;
        aliases?: string[];
        usage?: string;
    };
    beforeExecute?: (client: KiwiClient, message: Message, ...args: any[]) => Promise<boolean | void>;
    execute: (client: KiwiClient, message: Message, ...args: any[]) => Promise<void>;
    afterExecute?: (client: KiwiClient, message: Message, ...args: any[]) => Promise<void>;
}

export interface UserCommand {
    module?: Module | null;
    config: {
        type: CommandTypes.User;
        name: string;
    };
    beforeExecute?: (interaction: UserContextMenuCommandInteraction, client: KiwiClient) => Promise<boolean | void>;
    execute: (interaction: UserContextMenuCommandInteraction, client: KiwiClient) => Promise<void>;
    afterExecute?: (interaction: UserContextMenuCommandInteraction, client: KiwiClient) => Promise<void>;
}

export interface MessageCommand {
    module?: Module | null;
    config: {
        type: CommandTypes.Message;
        name: string;
    };
    beforeExecute?: (interaction: MessageContextMenuCommandInteraction, client: KiwiClient) => Promise<boolean | void>;
    execute: (interaction: MessageContextMenuCommandInteraction, client: KiwiClient) => Promise<void>;
    afterExecute?: (interaction: MessageContextMenuCommandInteraction, client: KiwiClient) => Promise<void>;
}

export interface SlashCommand {
    module?: Module | null;
    config: SlashCommandBuilder | any;
    autocomplete?: (client: KiwiClient, interaction: AutocompleteInteraction) => Promise<void>;
    beforeExecute?: (client: KiwiClient, interaction: ChatInputCommandInteraction) => Promise<boolean | void>;
    execute: (client: KiwiClient, interaction: ChatInputCommandInteraction) => Promise<void>;
    afterExecute?: (client: KiwiClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}

export enum CommandTypes {
    ChatInput = 1,
    User = 2,
    Message = 3,
}
