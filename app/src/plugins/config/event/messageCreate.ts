import { defineEvent, EventList } from "@/qewi";

export const messageCreate = defineEvent({
    id: EventList.MessageCreate,

    trigger: async function (ctx, message) {
        console.log("Message created");
        console.log(ctx, "\n--------------\n", message);
    },
});
