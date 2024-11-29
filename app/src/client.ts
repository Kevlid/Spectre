import {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
	ColorResolvable,
	ClientPresenceStatus,
} from 'discord.js';

import { DatabaseManager } from './managers/databaseManager';

import { EventManager } from './managers/eventManager';
import { ComponentManager } from './managers/componentManager';
import { PageManager } from './pageManager';
import { CommandManager } from './managers/commandManager';
import { ScheduleManager } from './managers/scheduleManager';
import { ModuleManager } from './managers/moduleManager';

export class KiwiClient extends Client {
	public Settings: {
		color: ColorResolvable;
	};
	public db: DatabaseManager;

	public EventManager: EventManager;
	public ComponentManager: ComponentManager;
	public CommandManager: CommandManager;
	public ScheduleManager: ScheduleManager;
	public ModuleManager: ModuleManager;

	public Pages: PageManager;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildPresences,
				//GatewayIntentBits.AutoModerationExecution,
				//GatewayIntentBits.AutoModerationConfiguration,
			],
			partials: [
				Partials.GuildMember,
				Partials.Channel,
				Partials.Message,
				Partials.User,
			],
			presence: {
				status: 'online' as ClientPresenceStatus,
			},
		});

		this.Settings = {
			color: '#7289DA',
		};

		// Database Manager
		this.db = new DatabaseManager(this);

		// Event Manager
		this.EventManager = new EventManager(this);

		// Component Manager
		this.ComponentManager = new ComponentManager(this);

		// Page Manager
		this.Pages = new PageManager(this);

		// Command Manager
		this.CommandManager = new CommandManager(this);

		// Schedule Manager
		this.ScheduleManager = new ScheduleManager(this);

		this.ModuleManager = new ModuleManager(this);
	}

	public capitalize(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	public createCustomIdV1(options: {
		customId: string;
		valueOne?: string;
		valueTwo?: string;
		valueThree?: string;
		valueFour?: string;
		userId?: string;
		ownerId?: string;
	}): string {
		var optionOne = options.valueOne || '';
		var optionTwo = options.valueTwo || '';
		var optionThree = options.valueThree || '';
		var optionFour = options.valueFour || '';
		var userId = options.userId || '';
		var ownerId = options.ownerId || '';
		return `+${options.customId}+?${optionOne}?&${optionTwo}&$${optionThree}$£${optionFour}£%${userId}%=${ownerId}=`;
	}

	createCustomId(options): string {
		var customId = '';
		for (const key in options) {
			if (customId.includes('&')) continue;
			customId += `&${key}=${options[key]}`;
		}
		return customId;
	}

	public createMessageUrl(
		guildId: string,
		channelId: string,
		messageId: string
	): string {
		return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
	}
}
