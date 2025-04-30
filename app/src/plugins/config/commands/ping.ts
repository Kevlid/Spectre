import { CommandTypes, defineCommand } from "@/qewi";

export const pingCommand = defineCommand({
    config: {
        name: "ping",
        description: "Ping the bot to check if it's alive",
        type: CommandTypes.ChatInput,
        default_member_permissions: null,
    },

    trigger: async function (ctx, data, interaction) {
        await interaction.reply("Pong!");
    },
});
