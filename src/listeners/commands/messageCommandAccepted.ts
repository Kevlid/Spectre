import { ApplyOptions } from "@sapphire/decorators";
import { Listener, Events, MessageCommandAcceptedPayload } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
    event: Events.MessageCommandAccepted,
    name: "messageCommandAccepted",
})
export class UserEvent extends Listener<typeof Events.MessageCommandAccepted> {
    public override run(payload: MessageCommandAcceptedPayload) {
        this.container.logger.debug(
            `Command "${payload.command.name}" accepted in ${payload.message.guild?.name ?? "DMs"} by ${
                payload.message.author.tag
            } (${payload.message.author.id})`
        );
    }
}
