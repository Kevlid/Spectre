import { env } from "@/env";
import { Precondition } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";

export class UserPrecondition extends Precondition {
    private async checkDeveloper(userId: string) {
        if (env.DEVELOPERS.includes(userId)) {
            return this.ok();
        }
        return this.error();
    }

    public override async messageRun(message: Message) {
        // for Message Commands
        return this.checkDeveloper(message.author.id);
    }

    public override async chatInputRun(interaction: CommandInteraction) {
        // for Slash Commands
        return this.checkDeveloper(interaction.user.id);
    }

    public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
        // for Context Menu Command
        return this.checkDeveloper(interaction.user.id);
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        developerOnly: never;
    }
}
