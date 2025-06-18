import { ApplyOptions } from "@sapphire/decorators";
import { Listener, Events, MessageCommandSuccessPayload } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
    event: Events.MessageCommandSuccess,
    name: "mmessageCommandSuccess",
})
export class UserEvent extends Listener<typeof Events.MessageCommandSuccess> {
    public override run(payload: MessageCommandSuccessPayload) {
        this.container.logger.debug(
            `Command "${payload.command.name}" executed successfully in ${payload.message.guild?.name ?? "DMs"} by ${
                payload.message.author.tag
            } (${payload.message.author.id})`
        );
    }
}
