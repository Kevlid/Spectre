import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { Events, VoiceState } from "discord.js";

@ApplyOptions<Listener.Options>({
    event: Events.VoiceStateUpdate,
    name: "statistics-voiceStateUpdate",
})
export class UserEvent extends Listener<typeof Events.VoiceStateUpdate> {
    public override run(oldState: VoiceState, newState: VoiceState) {}
}
