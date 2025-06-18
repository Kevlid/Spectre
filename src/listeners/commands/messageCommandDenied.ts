import { env } from "@/env";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener, Events, MessageCommandDeniedPayload, UserError } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
    event: Events.MessageCommandDenied,
    name: "messageCommandDenied",
})
export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
    public override run(userError: UserError, payload: MessageCommandDeniedPayload) {
        if (Reflect.get(Object(payload.context), "silent")) return;

        return payload.message.reply({
            content: userError.message,
            allowedMentions: { users: [payload.message.author.id], roles: [] },
        });
    }
}
