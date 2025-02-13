import { defineCommand, CommandTypes } from "@/qewi";

export const configCommand = defineCommand({
    id: "config",
    description: "Configure the bot",
    type: CommandTypes.ChatInput,

    trigger: async function (data, ctx) {
        console.log("Config command triggered");
        console.log(data, "\n--------------\n", ctx);
    },
});
