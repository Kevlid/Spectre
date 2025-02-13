import { defineCommand } from "@/qewi";

defineCommand({
    id: "config",

    trigger: async function (data, ctx) {
        console.log("Config command triggered");
        console.log(data, "\n--------------\n", ctx);
    },
});
