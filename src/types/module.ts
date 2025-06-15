import { PermissionResolvable } from "discord.js";

import { MessageCommand, PrefixCommand } from "./command";
import { SlashCommand } from "./command";
import { UserCommand } from "./command";
import { Button, SelectMenu } from "./component";
import { Event } from "./event";
import { Schedule } from "./schedule";

export interface Module {
    id: string;
    name?: string;
    events?: Event[];
    prefixCommands?: PrefixCommand[];
    slashCommands?: SlashCommand[];
    userCommands?: UserCommand[];
    messgaeCommands?: MessageCommand[];
    selectMenus?: SelectMenu[];
    buttons?: Button[];
    schedules?: Schedule[];
    default?: boolean;
}
