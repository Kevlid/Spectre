import {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
	ColorResolvable,
	ClientPresenceStatus,
	Message,
	TextChannel,
} from 'discord.js';

import { env } from './env';

import { DatabaseManager } from './managers/databaseManager';

import { EventManager } from './managers/eventManager';
import { ComponentManager } from './managers/componentManager';
import { PageManager } from './pageManager';
import { CommandManager } from './managers/commandManager';
import { ScheduleManager } from './managers/scheduleManager';
import { ModuleManager } from './managers/moduleManager';
import { CustomOptions } from './types/component';

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

	private _logChannel: TextChannel;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.MessageContent,
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

	public addSpace(value: string) {
		return value.replace(/([A-Z])/g, ' $1').trim();
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

	public createCustomId(options: CustomOptions): string {
		var customId = new Array<string>();
		for (var [key, value] of Object.entries(options)) {
			if (customId.includes('&')) continue;
			if (!key || !value) continue;
			key = this.ComponentManager.getShortKey(key);
			customId.push(`${key}=${value}`);
		}
		return customId.join('&');
	}

	public getBoolean(value: string) {
		if (value.toLowerCase() === 'true') {
			return true;
		} else {
			return false;
		}
	}

	public async getId(message: Message, value: string): Promise<string> {
		if (
			value.startsWith('<@') &&
			value.endsWith('>') &&
			!value.startsWith('<@&')
		) {
			value = value.slice(2, -1);
			if (value.startsWith('!')) {
				value = value.slice(1);
			}
		} else if (value.startsWith('<#') && value.endsWith('>')) {
			value = value.slice(2, -1);
		} else if (value.startsWith('<@&') && value.endsWith('>')) {
			value = value.slice(3, -1);
		} else if (value.includes('u') && message.reference) {
			var messageReference = await message.fetchReference();
			value = messageReference.author.id;
		} else if (!/^\d{17,19}$/.test(value)) {
			value = null;
		}
		return value;
	}

	public createMessageUrl(
		guildId: string,
		channelId: string,
		messageId: string
	): string {
		return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
	}
}
