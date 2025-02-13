import { defineCommand, CommandTypes, CommandContexts, IntegrationTypes, CommandOptionTypes } from "@/qewi";

export const configCommand = defineCommand({
    config: {
        name: "cfg",
        description: "..",
        type: CommandTypes.ChatInput,
    },

    trigger: async function (ctx, data) {
        console.log("Config command triggered");
        console.log(data, "\n--------------\n", ctx);
    },
});
