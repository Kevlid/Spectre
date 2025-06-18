import { ApplyOptions } from "@sapphire/decorators";
import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import { Message, MessageFlags } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "ping",
    aliases: ["pong"],
    description: "Ping the bot to see if it is alive",
    preconditions: ["GuildOnly"],
})
export class PingCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName("ping").setDescription("Ping bot to see if it is alive")
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const callbackResponse = await interaction.reply({
            content: `Ping?`,
            withResponse: true,
            flags: MessageFlags.Ephemeral,
        });
        const msg = callbackResponse.resource?.message;

        if (msg && isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
        }

        return interaction.editReply("Failed to retrieve ping :(");
    }

    public async messageRun(message: Message) {
        const start = Date.now();
        const response = await message.reply("Pinging...");
        const latency = Date.now() - start;
        return response.edit(`Pong! Latency: ${latency}ms`);
    }
}
