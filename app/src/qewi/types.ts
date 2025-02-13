import { PermissionResolvable } from "discord.js";

export interface QewiConfig {
    token: string;
    getGuildPrefix?: (guildId: string) => Promise<string>;
}

export interface Default {
    permissions?: Array<PermissionResolvable>;
    roles?: Array<string>;
}
