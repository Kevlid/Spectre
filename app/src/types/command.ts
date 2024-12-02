import { KiwiClient } from '@/client';
import { Module } from './module';

import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	Message,
	User,
	GuildMember,
	Channel,
	Role,
} from 'discord.js';

export interface PrefixCommand {
	module?: Module;
	level?: number;
	config: {
		name: string;
		description?: string;
		aliases?: string[];
		autoDelete: boolean;
		options?: {
			name: string;
			type: ConfigOptionTypes;
		}[];
	};
	checks?: (
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		...args: any[]
	) => Promise<boolean>;
	execute: (
		client: KiwiClient,
		message: Message,
		commandOptions: CommandOptions,
		...args: any[]
	) => Promise<void>;
}

export enum ConfigOptionTypes {
	USER = 1,
	MEMBER = 2,
	CHANNEL = 3,
	ROLE = 4,
	TEXT = 5,
	NUMBER = 6,
}

export interface CommandOptions {
	commandName: string;
	auther: string;
	//args: string[];
	[key: string]: User | GuildMember | Channel | Role | string;
}

export interface UserCommand {
	module?: Module;
	level?: number;
	config: {
		type: CommandTypes.User;
		name: string;
	};
	execute: (interaction, client: KiwiClient) => Promise<void>;
}

export interface SlashCommand {
	module?: Module;
	level?: number;
	config: SlashCommandBuilder | any;
	autocomplete?: (
		interaction: AutocompleteInteraction,
		client: KiwiClient
	) => Promise<void>;
	execute: (
		interaction: ChatInputCommandInteraction,
		client: KiwiClient
	) => Promise<void>;
}

export enum CommandTypes {
	ChatInput = 1,
	User = 2,
	Message = 3,
}
