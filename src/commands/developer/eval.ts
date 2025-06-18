import { ApplyOptions } from "@sapphire/decorators";
import { Command, Args } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";
import { codeBlock, isThenable } from "@sapphire/utilities";
import { Type } from "@sapphire/type";
import type { Message } from "discord.js";
import { inspect } from "util";

@ApplyOptions<Command.Options>({
    name: "eval",
    description: "Evaluates JavaScript code.",
    preconditions: ["developerOnly"],
    flags: ["async", "hidden", "showHidden", "silent", "s"],
    options: ["depth"],
})
export class UserCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        const code = await args.rest("string");

        const { result, success, type } = await this.eval(message, code, {
            async: args.getFlags("async"),
            depth: Number(args.getOption("depth")) ?? 0,
            showHidden: args.getFlags("hidden", "showHidden"),
        });

        const output = success ? codeBlock("js", String(result)) : `**ERROR**: ${codeBlock("bash", String(result))}`;
        if (args.getFlags("silent", "s")) return null;

        const typeFooter = `**Type**: ${codeBlock("typescript", type)}`;

        if (output.length > 2000) {
            return send(message, {
                content: `Output was too long... sent the result as a file.\n\n${typeFooter}`,
                files: [{ attachment: Buffer.from(output), name: "output.js" }],
            });
        }

        return send(message, `${output}\n${typeFooter}`);
    }

    private async eval(message: Message, code: string, flags: { async: boolean; depth: number; showHidden: boolean }) {
        if (flags.async) code = `(async () => {\n${code}\n})();`;

        const msg = message;

        let success = true;
        let result: unknown = null;

        try {
            result = eval(code);
        } catch (error) {
            if (error && error instanceof Error && error.stack) {
                this.container.client.logger.error(error);
            }
            result = error;
            success = false;
        }

        const type = new Type(result).toString();
        if (isThenable(result)) result = await result;

        if (typeof result !== "string") {
            result = inspect(result, {
                depth: flags.depth,
                showHidden: flags.showHidden,
            });
        }

        return { result, success, type };
    }
}
