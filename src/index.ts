import Sentry from "@sentry/node";
import { dataSource } from "./datasource";
import { LogLevel, SapphireClient } from "@sapphire/framework";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { env } from "./env";

async function bootstrap() {
    await Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV || "development",
    });

    //await dataSource.initialize();

    const client = new SapphireClient({
        baseUserDirectory: __dirname,
        intents: [
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel],
        shards: "auto",
        defaultPrefix: "?",
        caseInsensitiveCommands: true,
        caseInsensitivePrefixes: true,
        loadDefaultErrorListeners: false,
        loadMessageCommandListeners: true,
        logger: { level: LogLevel.Debug },
        presence: {
            activities: [
                {
                    name: "Kewi is very cute",
                    type: ActivityType.Custom,
                },
            ],
            status: "online",
        },
    });

    await client.login(env.DISCORD_TOKEN).catch((error) => {
        console.error("Failed to login:", error);
    });
}
bootstrap();
