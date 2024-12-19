import { Module } from "@/types/module";

// Prefix Commands
import { DisconnectPrefix } from "./prefix/disconnect";
import { DragPrefix } from "./prefix/drag";

export const ModerationModule: Module = {
	id: "moderation",
	prefixCommands: [DisconnectPrefix, DragPrefix],
};
