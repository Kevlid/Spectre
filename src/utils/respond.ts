import { Message, TextChannel, DMChannel, NewsChannel, PartialGroupDMChannel } from "discord.js";

export async function respond(message: Message, ...args: Parameters<TextChannel["send"]>) {
    if (message.channel instanceof PartialGroupDMChannel) return;
    try {
        await message.reply(...args);
    } catch (error) {
        await message.channel.send(...args);
    }
}
