import { Client, GatewayIntentBits, Partials } from "discord.js";

//import { EventManager } from "./managers/eventManager";
//import { ComponentManager } from "./managers/componentManager";
//import { CommandManager } from "./managers/commandManager";
//import { ScheduleManager } from "./managers/scheduleManager";
//import { ModuleManager } from "./managers/moduleManager";

export class DiscordClient extends Client {
    //public EventManager: EventManager;
    //public ComponentManager: ComponentManager;
    //public CommandManager: CommandManager;
    //public ScheduleManager: ScheduleManager;
    //public ModuleManager: ModuleManager;

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
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.AutoModerationConfiguration,
            ],
            partials: [
                Partials.ThreadMember,
                Partials.GuildMember,
                Partials.Reaction,
                Partials.Channel,
                Partials.Message,
                Partials.User,
            ],
            allowedMentions: {
                parse: [],
                repliedUser: true,
            },
        });

        // Event Manager
        //this.EventManager = new EventManager(this);

        // Component Manager
        //this.ComponentManager = new ComponentManager(this);

        // Command Manager
        //this.CommandManager = new CommandManager(this);

        // Schedule Manager
        //this.ScheduleManager = new ScheduleManager(this);

        //this.ModuleManager = new ModuleManager(this);
    }

    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public addSpace(value: string) {
        return value.replace(/([A-Z])/g, " $1").trim();
    }

    public getBoolean(value: string) {
        if (value.toLowerCase() === "true") {
            return true;
        } else {
            return false;
        }
    }

    public createMessageUrl(guildId: string, channelId: string, messageId: string): string {
        return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
    }
}
