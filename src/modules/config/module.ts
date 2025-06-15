import { Module } from "../../types/module";

// Prefix Commands
import { ConfigCommands } from "./config-commands";

export const ConfigModule: Module = {
    id: "config",
    prefixCommands: [...ConfigCommands],
    default: true,
};
